import { TTL } from "../config"
import { TxFinalizer } from "./txFinalizer"
import * as CW3Types from "../types"
import * as L from "../types/links"

export class TxBuilder {
  private cw3: L.CardanoWeb3
  private protocolParams: CW3Types.ProtocolParameters
  private changeAddress: string
  private scripts: Map<string, CW3Types.Script> = new Map()
  private queue: (() => unknown)[] = []
  private inputs: Map<string, CW3Types.Utxo> = new Map()
  private readInputs: Map<string, CW3Types.Utxo> = new Map()
  private collectInputs: Map<string, CW3Types.Utxo> = new Map()
  private remoteProtocolParams: boolean = false
  private remoteTxEvaluate: boolean = false
  private coinSelection: number = 2 // Default: LargestFirstMultiAsset
  __txBuilder: L.CML.TransactionBuilder

  constructor(cw3: L.CardanoWeb3) {
    this.cw3 = cw3
  }

  /** Attach script to transaction builder for using in next operations
   * @param script Script to attach
   * @returns TxBuilder instance
   */
  attachScript = (script: CW3Types.Script) => {
    const scriptHash = this.cw3.utils.script.scriptToScriptHash(script)
    this.scripts.set(scriptHash, script)
    return this
  }

  /**
   * Add UTXOs to read referenced data from
   * @param utxos UTXOs to read from
   * @returns TxBuilder instance
   */
  readFrom = (utxos: CW3Types.Utxo[]) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        if (utxo.script) {
          this.scripts.set(utxo.scriptHash, utxo.script)
        }
        this.readInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
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
  collectFrom = (utxos: CW3Types.Utxo[], redeemer?: string) => {
    this.queue.push(async () => {
      for (const utxoUnresolved of utxos) {
        const utxo = await this.cw3.provider.resolveUtxoDatumAndScript(utxoUnresolved)
        const { paymentCred } = this.cw3.utils.address.getCredentials(utxo.address)
        const script = this.scripts.get(paymentCred.hash)
        if (!script) {
          throw new Error(
            "Script is required for collectFrom() method. Attach script with attachScript() or readFrom() method"
          )
        }
        this.collectInputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = this.cw3.utils.tx.utxoToCore(utxo)
        const inputBuilder = this.cw3.libs.CML.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        switch (script.language) {
          case "Native":
            this.__txBuilder.add_input(
              inputBuilder.native_script(
                this.cw3.libs.CML.NativeScript.from_cbor_hex(script.script),
                this.cw3.libs.CML.NativeScriptWitnessInfo.assume_signature_count()
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
                  this.cw3.utils.script.scriptToPlutusScript(script),
                  redeemer
                ),
                this.cw3.libs.CML.Ed25519KeyHashList.new(),
                this.cw3.libs.CML.PlutusData.from_cbor_hex(utxo.datum!)
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
                  this.cw3.utils.script.scriptToPlutusScript(script),
                  redeemer
                ),
                this.cw3.libs.CML.Ed25519KeyHashList.new()
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
   * Add UTXOs to spend from
   * @param utxos UTXOs to spend from
   * @returns TxBuilder instance
   */
  addInputs = (utxos: CW3Types.Utxo[]) => {
    this.queue.push(async () => {
      for (const utxo of utxos) {
        this.inputs.set(`${utxo.index.toString()}@${utxo.transaction.id}`, utxo)
        const coreUtxo = this.cw3.utils.tx.utxoToCore(utxo)
        const inputBuilder = this.cw3.libs.CML.SingleInputBuilder.from_transaction_unspent_output(coreUtxo)
        this.__txBuilder.add_input(inputBuilder.payment_key())
      }
    })
    return this
  }

  /**
   * Main method to pay to address with/without data
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach (optional)
   * @returns TxBuilder instance
   * @throws Error if script is not provided with hash datum type
   */
  private payTo = (output: CW3Types.Output, datum?: CW3Types.DatumOutput, script?: CW3Types.Script) => {
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
   * Add Output with data to pay to contract with address check
   * @param output Output to pay to
   * @param datum Datum to attach
   * @param script Script to attach
   * @returns TxBuilder instance
   * @throws Error if address is not script type
   */
  payToContract = (output: CW3Types.Output, datum: CW3Types.DatumOutput, script?: CW3Types.Script) => {
    const { paymentCred } = this.cw3.utils.address.getCredentials(output.address)
    if (!paymentCred || paymentCred.type !== "script") {
      throw new Error("Invalid address for contract")
    }
    this.payTo(output, datum, script)
    return this
  }

  /**
   * Add Outputs to pay to addresses
   * @param outputs Outputs to pay to
   * @param datum Datum to attach (optional)
   * @param script Script to attach (optional)
   * @returns TxBuilder instance
   */
  addOutputs = (outputs: CW3Types.Output[], datum?: CW3Types.DatumOutput, script?: CW3Types.Script) => {
    for (const output of outputs) {
      this.payTo(output, datum, script)
    }
    return this
  }

  /**
   * Set transaction validity start interval
   * @param unixTime Unix timestamp
   * @returns TxBuilder instance
   */
  validFrom = (unixTime: number) => {
    this.queue.push(async () => {
      const slot = this.cw3.utils.time.unixTimeToSlot(unixTime)
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
      const slot = this.cw3.utils.time.unixTimeToSlot(unixTime)
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
      const slot = this.cw3.utils.time.unixTimeToSlot(Date.now() + slotsOffset * 1000)
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
      const { paymentCred, stakingCred, type } = this.cw3.utils.address.getCredentials(address)
      if (!paymentCred && !stakingCred) {
        throw new Error("Invalid address for required signer")
      }
      const credential = type == "reward" ? stakingCred : paymentCred
      if (credential.type === "script") {
        throw new Error("Only key hash (not script) is allowed for required signer")
      }
      this.__txBuilder.add_required_signer(this.cw3.libs.CML.Ed25519KeyHash.from_hex(credential.hash))
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
      this.__txBuilder.add_required_signer(this.cw3.libs.CML.Ed25519KeyHash.from_hex(keyHash))
    })
    return this
  }

  /**
   * Add minting of assets
   * @param assets Assets to mint
   * @param redeemer Redeemer to use (optional)
   * @returns TxBuilder instance
   */
  addMint = (assets: CW3Types.Asset[], redeemer?: string) => {
    this.queue.push(async () => {
      const policyId = assets[0].policyId
      const mintAssets = this.cw3.libs.CML.MapAssetNameToNonZeroInt64.new()
      for (const asset of assets) {
        if (asset.policyId !== policyId) throw new Error("All assets must have the same policyId")
        mintAssets.insert(this.cw3.libs.CML.AssetName.from_str(asset.assetName || ""), asset.quantity)
      }
      const script = this.scripts.get(policyId)
      if (!script) {
        throw new Error(
          "Script is required for addMint() method. Attach script with attachScript() or readFrom() method"
        )
      }
      const mintBuilder = this.cw3.libs.CML.SingleMintBuilder.new(mintAssets)
      switch (script.language) {
        case "Native":
          this.__txBuilder.add_mint(
            mintBuilder.native_script(
              this.cw3.libs.CML.NativeScript.from_cbor_hex(script.script),
              this.cw3.libs.CML.NativeScriptWitnessInfo.assume_signature_count()
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
              this.cw3.libs.CML.Ed25519KeyHashList.new()
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
  addMetadataString = (label: number, metadata: CW3Types.Json) => {
    this.queue.push(async () => {
      const metadatum = this.cw3.libs.CML.TransactionMetadatum.new_text(JSON.stringify(metadata))
      const metadataBuilder = this.cw3.libs.CML.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = this.cw3.libs.CML.AuxiliaryData.new()
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
  addMetadataJson = (label: number, metadata: CW3Types.Json, conversion: 0 | 1 | 2 = 0) => {
    this.queue.push(async () => {
      const metadatum = this.cw3.libs.CML.encode_json_str_to_metadatum(JSON.stringify(metadata), conversion)
      const metadataBuilder = this.cw3.libs.CML.Metadata.new()
      metadataBuilder.set(BigInt(label), metadatum)
      const aux = this.cw3.libs.CML.AuxiliaryData.new()
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
  withdrawRewards = (rewardAddress: string, amount: bigint, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      const withdrawBuilder = this.cw3.libs.CML.SingleWithdrawalBuilder.new(
        this.cw3.libs.CML.RewardAddress.from_address(this.cw3.libs.CML.Address.from_bech32(rewardAddress)),
        amount
      )
      switch (stakingCred.type) {
        case "key": {
          this.__txBuilder.add_withdrawal(withdrawBuilder.payment_key())
          break
        }
        case "script": {
          const script = this.scripts.get(stakingCred.hash)
          if (!script) {
            throw new Error(
              "Script is required for withdrawRewards() method. Attach script with attachScript() or readFrom() method"
            )
          }
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_withdrawal(
                withdrawBuilder.native_script(
                  this.cw3.libs.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.libs.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              if (!redeemer) {
                throw new Error(
                  "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                )
              }
              this.__txBuilder.add_withdrawal(
                withdrawBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.libs.CML.Ed25519KeyHashList.new()
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
  delegateTo = (rewardAddress: string, poolId: string, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards delegation (no staking credential)")
      switch (stakingCred.type) {
        case "key": {
          const credential = this.cw3.libs.CML.Credential.new_pub_key(
            this.cw3.libs.CML.Ed25519KeyHash.from_hex(stakingCred.hash)
          )
          const certificateBuilder = this.cw3.libs.CML.SingleCertificateBuilder.new(
            this.cw3.libs.CML.Certificate.new_stake_delegation(
              credential,
              this.cw3.libs.CML.Ed25519KeyHash.from_bech32(poolId)
            )
          )
          this.__txBuilder.add_cert(certificateBuilder.payment_key())
          break
        }
        case "script": {
          const script = this.scripts.get(stakingCred.hash)
          if (!script) {
            throw new Error(
              "Script is required for delegateTo() method. Attach script with attachScript() or readFrom() method"
            )
          }
          const credential = this.cw3.libs.CML.Credential.new_script(
            this.cw3.libs.CML.ScriptHash.from_hex(stakingCred.hash)
          )
          const certificateBuilder = this.cw3.libs.CML.SingleCertificateBuilder.new(
            this.cw3.libs.CML.Certificate.new_stake_delegation(
              credential,
              this.cw3.libs.CML.Ed25519KeyHash.from_bech32(poolId)
            )
          )
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_cert(
                certificateBuilder.native_script(
                  this.cw3.libs.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.libs.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              if (!redeemer) {
                throw new Error(
                  "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                )
              }
              this.__txBuilder.add_cert(
                certificateBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.libs.CML.Ed25519KeyHashList.new()
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
      const { stakingCred } = this.cw3.utils.address.getCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards withdrawal (no staking credential)")
      const credential =
        stakingCred.type === "key"
          ? this.cw3.libs.CML.Credential.new_pub_key(this.cw3.libs.CML.Ed25519KeyHash.from_hex(stakingCred.hash))
          : this.cw3.libs.CML.Credential.new_script(this.cw3.libs.CML.ScriptHash.from_hex(stakingCred.hash))
      const certificateBuilder = this.cw3.libs.CML.SingleCertificateBuilder.new(
        this.cw3.libs.CML.Certificate.new_stake_registration(credential)
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
  deregisterStake = (rewardAddress: string, redeemer?: string) => {
    this.queue.push(async () => {
      const { stakingCred } = this.cw3.utils.address.getCredentials(rewardAddress)
      if (!stakingCred) throw new Error("Invalid address for rewards deregistration (no staking credential)")
      switch (stakingCred.type) {
        case "key": {
          const credential = this.cw3.libs.CML.Credential.new_pub_key(
            this.cw3.libs.CML.Ed25519KeyHash.from_hex(stakingCred.hash)
          )
          const certificateBuilder = this.cw3.libs.CML.SingleCertificateBuilder.new(
            this.cw3.libs.CML.Certificate.new_stake_deregistration(credential)
          )
          this.__txBuilder.add_cert(certificateBuilder.payment_key())
          break
        }
        case "script": {
          const script = this.scripts.get(stakingCred.hash)
          if (!script) {
            throw new Error(
              "Script is required for delegateTo() method. Attach script with attachScript() or readFrom() method"
            )
          }
          const credential = this.cw3.libs.CML.Credential.new_script(
            this.cw3.libs.CML.ScriptHash.from_hex(stakingCred.hash)
          )
          const certificateBuilder = this.cw3.libs.CML.SingleCertificateBuilder.new(
            this.cw3.libs.CML.Certificate.new_stake_deregistration(credential)
          )
          switch (script.language) {
            case "Native":
              this.__txBuilder.add_cert(
                certificateBuilder.native_script(
                  this.cw3.libs.CML.NativeScript.from_cbor_hex(script.script),
                  this.cw3.libs.CML.NativeScriptWitnessInfo.assume_signature_count()
                )
              )
            case "PlutusV1":
            case "PlutusV2":
              if (!redeemer) {
                throw new Error(
                  "Redeemer is required for Plutus scripts. Use Data.void() if script doesn't require a redeemer"
                )
              }
              this.__txBuilder.add_cert(
                certificateBuilder.plutus_script(
                  this.cw3.utils.script.partialPlutusWitness(
                    this.cw3.utils.script.scriptToPlutusScript(script),
                    redeemer
                  ),
                  this.cw3.libs.CML.Ed25519KeyHashList.new()
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
        : this.cw3.__config.protocolParams
      this.__txBuilder = this.cw3.utils.tx.getTxBuilder(this.protocolParams)
      // Set Network ID
      this.__txBuilder.set_network_id(
        this.cw3.__config.network.type === "mainnet"
          ? this.cw3.libs.CML.NetworkId.mainnet()
          : this.cw3.libs.CML.NetworkId.testnet()
      )
      // Set default TTL
      this.__txBuilder.set_ttl(BigInt(this.cw3.utils.time.unixTimeToSlot(Date.now() + TTL * 1000)))
    }

    // Execute queue tasks
    for (const task of this.queue) {
      await task()
    }

    // Set Collateral
    if (
      this.__txBuilder
        .build_for_evaluation(
          this.cw3.libs.CML.ChangeSelectionAlgo.Default,
          this.cw3.libs.CML.Address.from_bech32(this.changeAddress)
        )
        .draft_tx()
        .witness_set()
        .redeemers()
    ) {
      // TODO: Select up to maxCollateralInputs collaterals
      const collateral = [...this.inputs.values()].find((utxo) => utxo.value > 5_000_000)
      if (!collateral) throw new Error("Suitable collateral > 5 ADA not found")
      // Add Collateral
      this.__txBuilder.add_collateral(
        this.cw3.libs.CML.SingleInputBuilder.from_transaction_unspent_output(
          this.cw3.utils.tx.utxoToCore(collateral)
        ).payment_key()
      )
      // Add Collateral Return
      this.__txBuilder.set_collateral_return(
        this.cw3.libs.CML.TransactionOutputBuilder.new()
          .with_address(this.cw3.libs.CML.Address.from_bech32(this.changeAddress))
          .next()
          .with_value(this.cw3.utils.tx.assetsToValue(collateral.value - BigInt(3_000_000), collateral.assets))
          .build()
          .output()
      )
    }

    // Coin Selection
    if (this.coinSelection !== -1) this.__txBuilder.select_utxos(this.coinSelection)

    // Evaluate TX phase two execution cost and set ex_units
    const draftTx = this.__txBuilder
      .build_for_evaluation(
        this.cw3.libs.CML.ChangeSelectionAlgo.Default,
        this.cw3.libs.CML.Address.from_bech32(this.changeAddress)
      )
      .draft_tx()
    const draftTxRedeemers = draftTx.witness_set().redeemers()
    if (draftTxRedeemers) {
      if (!this.remoteTxEvaluate) {
        const costModels = this.cw3.utils.tx.createCostModels(this.protocolParams.costModels)
        const slotConfig = this.cw3.__config.slotConfig
        const zeroRedeemers = this.cw3.libs.CML.LegacyRedeemerList.new()
        for (let i = 0; i < draftTxRedeemers.as_arr_legacy_redeemer()!.len(); i++) {
          const redeemer = draftTxRedeemers.as_arr_legacy_redeemer()!.get(i)
          const zeroRedeemer = this.cw3.libs.CML.LegacyRedeemer.new(
            redeemer.tag(),
            redeemer.index(),
            redeemer.data(),
            this.cw3.libs.CML.ExUnits.new(0n, 0n)
          )
          zeroRedeemers.add(zeroRedeemer)
        }
        const draftTxWitnesses = draftTx.witness_set()
        draftTxWitnesses.set_redeemers(this.cw3.libs.CML.Redeemers.new_arr_legacy_redeemer(zeroRedeemers))
        const newTx = this.cw3.libs.CML.Transaction.new(
          draftTx.body(),
          draftTxWitnesses,
          true,
          draftTx.auxiliary_data()
        )
        const allInputs = [...this.inputs.values(), ...this.readInputs.values(), ...this.collectInputs.values()]
        const inputs = allInputs.map((utxo) => this.cw3.utils.tx.utxoToTransactionInput(utxo).to_cbor_bytes())
        const outputs = allInputs.map((utxo) => this.cw3.utils.tx.utxoToTransactionOutput(utxo).to_cbor_bytes())
        const uplcEvaluatedRedeemers = this.cw3.libs.UPLC.eval_phase_two_raw(
          newTx.to_cbor_bytes(),
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
          const redeemer = this.cw3.libs.CML.LegacyRedeemer.from_cbor_bytes(evaluatedRedeemer)
          const exUnits = this.cw3.libs.CML.ExUnits.new(redeemer.ex_units().mem(), redeemer.ex_units().steps())
          this.__txBuilder.set_exunits(
            this.cw3.libs.CML.RedeemerWitnessKey.new(redeemer.tag(), redeemer.index()),
            exUnits
          )
        }
      } else {
        throw new Error("Remote TX evaluation is not supported yet")
      }
    }

    // Final calculations
    this.__txBuilder.add_change_if_needed(this.cw3.libs.CML.Address.from_bech32(this.changeAddress), true)

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
        .build(this.cw3.libs.CML.ChangeSelectionAlgo.Default, this.cw3.libs.CML.Address.from_bech32(this.changeAddress))
        .build_unchecked()
        .to_cbor_hex()
    )
  }
}
