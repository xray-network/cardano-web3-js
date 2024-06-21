import { TTL } from "../config"
import { TxFinalizer } from "./txFinalizer"
import * as T from "../types"

export class TxBuilder {
  private cw3: T.CardanoWeb3
  private protocolParams: T.ProtocolParameters
  private changeAddress: string
  private queue: (() => unknown)[] = []
  private inputs: Map<string, T.Utxo> = new Map()
  private readInputs: Map<string, T.Utxo> = new Map()
  private collectInputs: Map<string, T.Utxo> = new Map()
  private collaterals: Map<string, T.Utxo> = new Map()
  private remoteProtocolParams: boolean = false
  private remoteTxEvaluate: boolean = false
  private coinSelection: number = 2 // Default: LargestFirstMultiAsset
  __txBuilder: T.CML.TransactionBuilder

  constructor(cw3: T.CardanoWeb3) {
    this.cw3 = cw3
  }

  /**
   * Add UTXOs to read referenced data from
   * @param utxos UTXOs to read from
   * @returns TxBuilder instance
   */
  readFrom = (utxos: T.Utxo[]) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        this.readInputs.set(`${utxo.transaction.id}@${utxo.index.toString()}`, utxo)
        const input = this.cw3.utils.tx.utxoToCore(utxo)
        this.__txBuilder.add_reference_input(input)
      }
    })
    return this
  }

  /**
   * Add script UTXOs to spend from
   * @param utxos UTXOs to collect from
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  collectFrom = (utxos: T.Utxo[], redeemer?: string) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        if (!utxo.script) {
          throw new Error("Address must have a script to collect from it")
        }
        this.collectInputs.set(`${utxo.transaction.id}@${utxo.index.toString()}`, utxo)
        const coreUtxo = this.cw3.utils.tx.utxoToCore(utxo)
        const inputBuilder = this.cw3.CML.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        switch (utxo.script.language) {
          case "Native":
            this.__txBuilder.add_input(
              inputBuilder.native_script(
                this.cw3.CML.NativeScript.from_cbor_hex(utxo.script.script),
                this.cw3.CML.NativeScriptWitnessInfo.assume_signature_count()
              )
            )
            break
          case "PlutusV1":
            if (!redeemer) {
              throw new Error(
                "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
              )
            }
            this.__txBuilder.add_input(
              inputBuilder.plutus_script(
                this.cw3.utils.script.partialPlutusWitness(
                  this.cw3.utils.script.scriptToPlutusScript(utxo.script),
                  redeemer
                ),
                this.cw3.CML.Ed25519KeyHashList.new(),
                this.cw3.CML.PlutusData.from_cbor_hex(utxo.datum!)
              )
            )
            break
          case "PlutusV2":
            if (!redeemer) {
              throw new Error(
                "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
              )
            }
            this.__txBuilder.add_input(
              inputBuilder.plutus_script_inline_datum(
                this.cw3.utils.script.partialPlutusWitness(
                  this.cw3.utils.script.scriptToPlutusScript(utxo.script),
                  redeemer
                ),
                this.cw3.CML.Ed25519KeyHashList.new()
              )
            )
            break
          case "PlutusV3":
            throw new Error("PlutusV3 scripts are not supported yet")
        }
      }
    })
    return this
  }

  /**
   * Add UTXO to spend from
   * @param utxo UTXO to spend from
   * @returns TxBuilder instance
   */
  addInput = (utxo: T.Utxo) => {
    this.queue.push(async () => {
      this.inputs.set(`${utxo.transaction.id}@${utxo.index.toString()}`, utxo)
      const coreUtxo = this.cw3.utils.tx.utxoToCore(utxo)
      const inputBuilder = this.cw3.CML.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
      this.__txBuilder.add_input(inputBuilder.payment_key())
    })
    return this
  }

  /**
   * Add UTXOs to spend from
   * @param utxos UTXOs to spend from
   * @returns TxBuilder instance
   */
  addInputs = (utxos: T.Utxo[]) => {
    for (const utxo of utxos) {
      this.addInput(utxo)
    }
    return this
  }

  private payTo = (output: T.Output, datum?: T.DatumOutput, script?: T.Script) => {
    this.queue.push(async () => {
      const outputBuilder = this.cw3.utils.tx.outputToTransactionOutputBuilder(output, datum, script)
      const outputBuilderResult =
        output.value > 0n
          ? outputBuilder.next().with_value(this.cw3.utils.tx.assetsToValue(output.value, output.assets)).build()
          : outputBuilder
              .next()
              .with_asset_and_min_required_coin(
                this.cw3.utils.tx.assetsToValue(output.value, output.assets).multi_asset(),
                this.protocolParams.coinsPerUtxoByte
              )
              .build()
      this.__txBuilder.add_output(outputBuilderResult)
    })
    return this
  }

  /**
   * Add Output with aux data to pay to any address
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach (optional)
   * @returns TxBuilder instance
   */
  payToAddressWithData = (output: T.Output, datum: T.DatumOutput, script?: T.Script) => {
    this.payTo(output, datum, script)
    return this
  }

  /**
   * Add Output with aux data to pay to contract with address check
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach
   * @returns TxBuilder instance
   */
  payToContract = (output: T.Output, datum: T.DatumOutput, script: T.Script) => {
    const { paymentCred } = this.cw3.utils.address.getPublicCredentials(output.address)
    if (!paymentCred || paymentCred.type !== "script") {
      throw new Error("Invalid address for contract")
    }
    this.payTo(output, datum, script)
    return this
  }

  /**
   * Add Output (without Datums/Scripts) to pay to address
   * @param output Output to pay to
   * @returns TxBuilder instance
   */
  addOutput = (output: T.Output) => {
    this.payTo(output)
    return this
  }

  /**
   * Add Outputs (without Datums/Scripts) to pay to addresses
   * @param outputs Outputs to pay to
   * @returns TxBuilder instance
   */
  addOutputs = (outputs: T.Output[]) => {
    for (const output of outputs) {
      this.payTo(output)
    }
    return this
  }

  /**
   * Add Collateral to spend from in case it second eval phase is failed, by default auto selected from inputs if scripts are present in collected inputs
   * @param utxo Collateral to spend from
   * @returns TxBuilder instance
   */
  addCollateral = (utxo: T.Utxo) => {
    // TODO: Select up to maxCollateralInputs collaterals
    // const { maxCollateralInputs } = this.protocolParams
    if (this.collaterals.size >= 1) {
      throw new Error("Max collateral inputs reached (only one yet)")
    }
    this.collaterals.set(`${utxo?.transaction.id}@${utxo?.index.toString()}`, utxo)
    return this
  }

  /**
   * Set transaction validity start interval
   * @param unixTime Unix timestamp
   * @returns TxBuilder instance
   */
  validFrom = (unixTime: number) => {
    this.queue.push(async () => {
      const slot = this.cw3.utils.time.unixTimeToSlot(unixTime, this.cw3.slotConfig)
      this.__txBuilder.set_validity_start_interval(BigInt(slot))
    })
    return this
  }

  /**
   * Set transaction validity end interval by Unix timestamp
   * @param unixTime Unix timestamp
   * @returns TxBuilder instance
   */
  validTo = (unixTime: number) => {
    this.queue.push(async () => {
      const slot = this.cw3.utils.time.unixTimeToSlot(unixTime, this.cw3.slotConfig)
      this.__txBuilder.set_ttl(BigInt(slot))
    })
    return this
  }

  /**
   * Set transaction validity end interval (TTL) in slots from now
   * @param slotsOffset Slots offset
   * @returns TxBuilder instance
   */
  setTtl = (slotsOffset: number) => {
    this.queue.push(async () => {
      const slot = this.cw3.utils.time.unixTimeToSlot(Date.now() + slotsOffset * 1000, this.cw3.slotConfig)
      this.__txBuilder.set_ttl(BigInt(slot))
    })
    return this
  }

  /**
   * Set change address
   * @param address Change address
   * @returns TxBuilder instance
   */
  setChangeAddress = (address: string) => {
    this.changeAddress = address
    return this
  }

  /**
   * Add Required Signer by address
   * @param address Address of required signer
   * @returns TxBuilder instance
   */
  addRequiredSignerByAddress = (address: string) => {
    this.queue.push(() => {
      const { paymentCred, stakingCred, type } = this.cw3.utils.address.getPublicCredentials(address)
      if (!paymentCred && !stakingCred) {
        throw new Error("Invalid address for required signer")
      }
      const credential = type == "reward" ? stakingCred : paymentCred
      if (credential.type === "script") {
        throw new Error("Only key hash (not script) is allowed for required signer")
      }
      this.__txBuilder.add_required_signer(this.cw3.CML.Ed25519KeyHash.from_hex(credential.hash))
    })
    return this
  }

  /**
   * Add Required Signer by key hash
   * @param keyHash Key hash of required signer
   * @returns TxBuilder instance
   */
  addRequiredSignerByKey = (keyHash: string) => {
    this.queue.push(() => {
      this.__txBuilder.add_required_signer(this.cw3.CML.Ed25519KeyHash.from_hex(keyHash))
    })
    return this
  }

  /**
   * Add script to transaction aux data
   * @param script Script to attach
   * @returns TxBuilder instance
   */
  addScript = (script: T.Script) => {
    this.queue.push(async () => {
      if (script.language === "Native") {
        const nativeScriptList = this.cw3.CML.NativeScriptList.new()
        nativeScriptList.add(this.cw3.CML.NativeScript.from_cbor_hex(script.script))
        const aux = this.cw3.CML.AuxiliaryData.new()
        aux.add_native_scripts(nativeScriptList)
        this.__txBuilder.add_auxiliary_data(aux)
      }
      if (script.language === "PlutusV1") {
        const doubleEncodedScript = this.cw3.utils.script.applyDoubleCborEncoding(script)
        const plutusScript = this.cw3.CML.PlutusV1Script.from_cbor_hex(doubleEncodedScript)
        const plutusScriptList = this.cw3.CML.PlutusV1ScriptList.new()
        plutusScriptList.add(plutusScript)
        const aux = this.cw3.CML.AuxiliaryData.new()
        aux.add_plutus_v1_scripts(plutusScriptList)
        this.__txBuilder.add_auxiliary_data(aux)
      }
      if (script.language === "PlutusV2") {
        const doubleEncodedScript = this.cw3.utils.script.applyDoubleCborEncoding(script)
        const plutusScript = this.cw3.CML.PlutusV2Script.from_cbor_hex(doubleEncodedScript)
        const plutusScriptList = this.cw3.CML.PlutusV2ScriptList.new()
        plutusScriptList.add(plutusScript)
        const aux = this.cw3.CML.AuxiliaryData.new()
        aux.add_plutus_v2_scripts(plutusScriptList)
        this.__txBuilder.add_auxiliary_data(aux)
      }
      if (script.language === "PlutusV3") {
        throw new Error("PlutusV3 scripts are not supported yet")
      }
    })
    return this
  }

  /**
   * Add minting of assets
   * @param assets Assets to mint
   * @param script Script to attach (optional)
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  addMint = (assets: T.Asset[], script: T.Script, redeemer?: string) => {
    this.queue.push(async () => {
      const policyId = assets[0].policyId
      const mintAssets = this.cw3.CML.MapAssetNameToNonZeroInt64.new()
      for (const asset of assets) {
        if (asset.policyId !== policyId) throw new Error("All assets must have the same policyId")
        mintAssets.insert(this.cw3.CML.AssetName.from_str(asset.assetName || ""), asset.quantity)
      }
      const mintBuilder = this.cw3.CML.SingleMintBuilder.new(mintAssets)
      if (!script) {
        throw new Error("Native or Plutus script is required to mint assets")
      }
      switch (script.language) {
        case "Native":
          this.__txBuilder.add_mint(
            mintBuilder.native_script(
              this.cw3.CML.NativeScript.from_cbor_hex(script.script),
              this.cw3.CML.NativeScriptWitnessInfo.assume_signature_count()
            )
          )
          break
        case "PlutusV1":
        case "PlutusV2":
          if (!redeemer) {
            throw new Error(
              "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
            )
          }
          this.__txBuilder.add_mint(
            mintBuilder.plutus_script(
              this.cw3.utils.script.partialPlutusWitness(this.cw3.utils.script.scriptToPlutusScript(script), redeemer),
              this.cw3.CML.Ed25519KeyHashList.new()
            )
          )
          break
        case "PlutusV3":
          throw new Error("PlutusV3 scripts are not supported yet")
      }
    })
    return this
  }

  /**
   * Add metadata as string to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @returns TxBuilder instance
   */
  addMetadataString = (label: number, metadata: T.Json) => {
    this.queue.push(async () => {
      const metadatum = this.cw3.CML.TransactionMetadatum.new_text(JSON.stringify(metadata))
      const metadataBuilder = this.cw3.CML.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = this.cw3.CML.AuxiliaryData.new()
      aux.add_metadata(metadataBuilder)
      this.__txBuilder.add_auxiliary_data(aux)
    })
    return this
  }

  /**
   * Add metadata as JSON (with conversion) to transaction
   * @param label Metadata label
   * @param metadata Metadata to attach
   * @param conversion Conversion type (optional, 0: default, 1: detailed, 2: more detailed)
   * @returns TxBuilder instance
   */
  addMetadataJson = (label: number, metadata: T.Json, conversion: 0 | 1 | 2 = 0) => {
    this.queue.push(async () => {
      const metadatum = this.cw3.CML.encode_json_str_to_metadatum(JSON.stringify(metadata), conversion)
      const metadataBuilder = this.cw3.CML.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = this.cw3.CML.AuxiliaryData.new()
      aux.add_metadata(metadataBuilder)
      this.__txBuilder.add_auxiliary_data(aux)
    })
    return this
  }

  /**
   * Add withdrawal of rewards
   * @param rewardAddress Reward address to withdraw from
   * @param amount Amount to withdraw
   * @param script Script to attach (optional)
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  withdrawRewards = (rewardAddress: string, amount: bigint, script?: T.Script, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getPublicCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      const withdrawBuilder = this.cw3.CML.SingleWithdrawalBuilder.new(
        this.cw3.CML.RewardAddress.from_address(this.cw3.CML.Address.from_bech32(rewardAddress)),
        amount
      )
      switch (stakingCred.type) {
        case "key": {
          this.__txBuilder.add_withdrawal(withdrawBuilder.payment_key())
          break
        }
        case "script": {
          if (!redeemer) {
            throw new Error(
              "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
            )
          }
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_withdrawal(
                withdrawBuilder.native_script(
                  this.cw3.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              this.__txBuilder.add_withdrawal(
                withdrawBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.CML.Ed25519KeyHashList.new()
                )
              )
              break
            case "PlutusV3":
              throw new Error("PlutusV3 scripts are not supported yet")
          }
          break
        }
      }
    })
    return this
  }

  /**
   * Delegate to pool
   * @param rewardAddress Reward address to delegate from
   * @param poolId Pool ID to delegate to
   * @param script Script to attach (optional)
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  delegateTo = (rewardAddress: string, poolId: string, script?: T.Script, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getPublicCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      switch (stakingCred.type) {
        case "key": {
          const credential = this.cw3.CML.Credential.new_pub_key(this.cw3.CML.Ed25519KeyHash.from_hex(stakingCred.hash))
          const certificateBuilder = this.cw3.CML.SingleCertificateBuilder.new(
            this.cw3.CML.Certificate.new_stake_delegation(credential, this.cw3.CML.Ed25519KeyHash.from_bech32(poolId))
          )
          this.__txBuilder.add_cert(certificateBuilder.payment_key())
          break
        }
        case "script": {
          if (!redeemer) {
            throw new Error(
              "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
            )
          }
          if (!script) {
            throw new Error("Native or Plutus script is required for script staking delegation")
          }
          const credential = this.cw3.CML.Credential.new_script(this.cw3.CML.ScriptHash.from_hex(stakingCred.hash))
          const certificateBuilder = this.cw3.CML.SingleCertificateBuilder.new(
            this.cw3.CML.Certificate.new_stake_delegation(credential, this.cw3.CML.Ed25519KeyHash.from_bech32(poolId))
          )
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_cert(
                certificateBuilder.native_script(
                  this.cw3.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              this.__txBuilder.add_cert(
                certificateBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.CML.Ed25519KeyHashList.new()
                )
              )
              break
            case "PlutusV3":
              throw new Error("PlutusV3 scripts are not supported yet")
          }
          break
        }
      }
    })
    return this
  }

  /**
   * Register stake address
   * @param rewardAddress Reward address to register
   * @returns TxBuilder instance
   */
  registerStake = (rewardAddress: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getPublicCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      const credential =
        stakingCred.type === "key"
          ? this.cw3.CML.Credential.new_pub_key(this.cw3.CML.Ed25519KeyHash.from_hex(stakingCred.hash))
          : this.cw3.CML.Credential.new_script(this.cw3.CML.ScriptHash.from_hex(stakingCred.hash))
      const certificateBuilder = this.cw3.CML.SingleCertificateBuilder.new(
        this.cw3.CML.Certificate.new_stake_registration(credential)
      )
      this.__txBuilder.add_cert(certificateBuilder.skip_witness())
    })
    return this
  }

  /**
   * Deregister stake address
   * @param rewardAddress Reward address to deregister
   * @param script Script to attach (optional)
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  deregisterStake = (rewardAddress: string, script?: T.Script, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getPublicCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      switch (stakingCred.type) {
        case "key": {
          const credential = this.cw3.CML.Credential.new_pub_key(this.cw3.CML.Ed25519KeyHash.from_hex(stakingCred.hash))
          const certificateBuilder = this.cw3.CML.SingleCertificateBuilder.new(
            this.cw3.CML.Certificate.new_stake_deregistration(credential)
          )
          this.__txBuilder.add_cert(certificateBuilder.payment_key())
          break
        }
        case "script": {
          if (!redeemer) {
            throw new Error(
              "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
            )
          }
          if (!script) {
            throw new Error("Native or Plutus script is required for script staking deregistration")
          }
          const credential = this.cw3.CML.Credential.new_script(this.cw3.CML.ScriptHash.from_hex(stakingCred.hash))
          const certificateBuilder = this.cw3.CML.SingleCertificateBuilder.new(
            this.cw3.CML.Certificate.new_stake_deregistration(credential)
          )
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_cert(
                certificateBuilder.native_script(
                  this.cw3.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              this.__txBuilder.add_cert(
                certificateBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.CML.Ed25519KeyHashList.new()
                )
              )
              break
            case "PlutusV3":
              throw new Error("PlutusV3 scripts are not supported yet")
          }
        }
      }
    })
    return this
  }

  /**
   * Fetch protocol parameters from remote on TX build
   * @param remoteProtocolParams Fetch protocol parameters from remote
   * @returns TxBuilder instance
   */
  withRemoteProtocolParams = (remoteProtocolParams: boolean) => {
    this.remoteProtocolParams = remoteProtocolParams
    return this
  }

  /**
   * Evaluate TX execution cost remotely
   * @param remoteTxEvaluate Evaluate TX execution cost remotely
   * @returns TxBuilder instance
   */
  withRemoteTxEvaluate = (remoteTxEvaluate: boolean) => {
    this.remoteTxEvaluate = remoteTxEvaluate
    return this
  }

  /**
   * Set coin selection strategy
   *
   * -1: Include all inputs
   *
   * 0: LargestFirst: Performs CIP2's Largest First ada-only selection. Will error if outputs contain non-ADA assets
   *
   * 1: RandomImprove: Performs CIP2's Random Improve ada-only selection. Will error if outputs contain non-ADA assets
   *
   * 2: LargestFirstMultiAsset: Same as LargestFirst, but before adding ADA, will insert by largest-first for each asset type
   *
   * 3: RandomImproveMultiAsset: Same as RandomImprove, but before adding ADA, will insert by random-improve for each asset type
   *
   * @param strategy Coin selection strategy
   * @returns TxBuilder instance
   */
  setCoinSelection = (strategy: -1 | 0 | 1 | 2 | 3) => {
    this.coinSelection = strategy
    return this
  }

  /**
   * Apply all methods and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  apply = async () => {
    // Check if change address is set
    if (!this.changeAddress) {
      throw new Error("Change address is required. Use setChangeAddress() method to set it")
    }

    // Initialize Transaction Builder
    if (!this.__txBuilder) {
      // Get Protocol Parameters (from local or remote)
      this.protocolParams = this.remoteProtocolParams
        ? await this.cw3.provider.getProtocolParameters()
        : this.cw3.protocolParams
      this.__txBuilder = this.cw3.utils.tx.getTxBuilder(this.protocolParams)
      // Set Network ID
      this.__txBuilder.set_network_id(
        this.cw3.network.type === "mainnet" ? this.cw3.CML.NetworkId.mainnet() : this.cw3.CML.NetworkId.testnet()
      )
      // Set default TTL
      this.__txBuilder.set_ttl(BigInt(this.cw3.utils.time.unixTimeToSlot(Date.now() + TTL * 1000, this.cw3.slotConfig)))
    }

    // Execute queue tasks
    for (const task of this.queue) {
      await task()
    }

    // Set Collateral
    if (
      this.__txBuilder.get_auxiliary_data().plutus_v1_scripts().len() > 0 ||
      this.__txBuilder.get_auxiliary_data().plutus_v2_scripts().len() > 0
    ) {
      // TODO: Select up to maxCollateralInputs collaterals
      const collateral =
        this.collaterals.size > 0
          ? [...this.collaterals.values()][0]
          : [...this.inputs.values()].find((utxo) => utxo.value > 5_000_000)
      if (!collateral) throw new Error("Suitable collateral not found")
      if (collateral.value < 5_000_000) throw new Error("Collateral must be at least 5 ADA")
      // Add Collateral
      this.__txBuilder.add_collateral(
        this.cw3.CML.SingleInputBuilder.from_transaction_unspent_output(
          this.cw3.utils.tx.utxoToCore(collateral)
        ).payment_key()
      )
      // Add Collateral Return
      this.__txBuilder.set_collateral_return(
        this.cw3.CML.TransactionOutputBuilder.new()
          .with_address(this.cw3.CML.Address.from_bech32(this.changeAddress))
          .next()
          .with_value(this.cw3.utils.tx.assetsToValue(collateral.value - BigInt(4_000_000), collateral.assets))
          .build()
          .output()
      )
    }

    // Coin Selection
    if (this.coinSelection !== -1) this.__txBuilder.select_utxos(this.coinSelection)

    // Evaluate TX phase two execution cost and set ex_units
    const draftTxBuild = this.__txBuilder.build_for_evaluation(
      this.cw3.CML.ChangeSelectionAlgo.Default,
      this.cw3.CML.Address.from_bech32(this.changeAddress)
    )
    let draftTx = draftTxBuild.draft_tx()
    const draftTxRedeemers = draftTx.witness_set().redeemers()
    if (draftTxRedeemers) {
      if (!this.remoteTxEvaluate) {
        const costModels = this.cw3.utils.tx.createCostModels(this.protocolParams.costModels)
        const slotConfig = this.cw3.slotConfig
        const zeroRedeemers = this.cw3.CML.LegacyRedeemerList.new()
        for (let i = 0; i < draftTxRedeemers.as_arr_legacy_redeemer()!.len(); i++) {
          const redeemer = draftTxRedeemers.as_arr_legacy_redeemer()!.get(i)
          const zeroRedeemer = this.cw3.CML.LegacyRedeemer.new(
            redeemer.tag(),
            redeemer.index(),
            redeemer.data(),
            this.cw3.CML.ExUnits.new(0n, 0n)
          )
          zeroRedeemers.add(zeroRedeemer)
        }
        const draftTxWitnesses = draftTx.witness_set()
        draftTxWitnesses.set_redeemers(this.cw3.CML.Redeemers.new_arr_legacy_redeemer(zeroRedeemers))
        draftTx = this.cw3.CML.Transaction.new(draftTx.body(), draftTxWitnesses, true, draftTx.auxiliary_data())
        const allInputs = [
          ...this.inputs.values(),
          ...this.readInputs.values(),
          ...this.collectInputs.values(),
          ...this.collaterals.values(),
        ]
        const inputs = allInputs.map((utxo) => this.cw3.utils.tx.utxoToTransactionInput(utxo).to_cbor_bytes())
        const outputs = allInputs.map((utxo) => this.cw3.utils.tx.utxoToTransactionOutput(utxo).to_cbor_bytes())
        const uplcEvaluatedRedeemers = this.cw3.UPLC.eval_phase_two_raw(
          draftTx.to_cbor_bytes(),
          inputs,
          outputs,
          costModels.to_cbor_bytes(),
          this.protocolParams.maxTxExSteps,
          this.protocolParams.maxTxExMem,
          BigInt(slotConfig.zeroTime),
          BigInt(slotConfig.zeroSlot),
          slotConfig.slotDuration
        )
        for (const evaluatedRedeemer of uplcEvaluatedRedeemers) {
          const redeemer = this.cw3.CML.LegacyRedeemer.from_cbor_bytes(evaluatedRedeemer)
          const exUnits = this.cw3.CML.ExUnits.new(redeemer.ex_units().mem(), redeemer.ex_units().steps())
          this.__txBuilder.set_exunits(this.cw3.CML.RedeemerWitnessKey.new(redeemer.tag(), redeemer.index()), exUnits)
        }
      } else {
        throw new Error("Remote TX evaluation is not supported yet")
      }
    }

    // Final calculations
    this.__txBuilder.add_change_if_needed(this.cw3.CML.Address.from_bech32(this.changeAddress), true)

    return this
  }

  /**
   * Apply all methods, build TX and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  applyAndBuild = async () => {
    await this.apply()
    return new TxFinalizer(
      this.cw3,
      this.__txBuilder
        .build(this.cw3.CML.ChangeSelectionAlgo.Default, this.cw3.CML.Address.from_bech32(this.changeAddress))
        .build_unchecked()
        .to_cbor_hex()
    )
  }
}
