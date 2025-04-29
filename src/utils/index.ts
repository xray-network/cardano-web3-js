import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import MSL from "@emurgo/cardano-message-signing-nodejs"
import UPLC from "uplc-node"
import { Buffer } from "buffer"
import * as Bech32 from "bech32"
import Blake2b from "blake2b"
import * as Bip39 from "bip39"
import * as Cborg from "cborg"
import walletChecksum from "./cip4"
import { Message } from "./message"
import { Data as PlutusData, Constr as PlutusConstr } from "./plutusData"
import * as CW3Types from "../types"

export class Utils {
  libs = {
    /**
     * dcSpark @ Cardano Multiplatform Library
     */
    CML: CML,

    /**
     * Emurgo @ Message Signing Library
     */
    MSL: MSL,

    /**
     * Untyped Plutus Core Library
     */
    UPLC: UPLC,

    /**
     * Lucid Plutus Data Serialization Lib
     */
    PlutusData: PlutusData(),

    /**
     * Lucid Plutus Data Construction Lib
     */
    PlutusConstr: PlutusConstr,

    /**
     * Cardano Web3 Library
     */
    Message: Message(),

    /**
     * Cbor encoding and decoding library
     */
    Cborg: Cborg,

    /**
     * Bech32 encoding and decoding library
     */
    Bech32: Bech32,

    /**
     * Blake2b hashing library
     */
    Blake2b: Blake2b,

    /**
     * Bip39 mnemonic library (only english words supported)
     */
    Bip39: Bip39,

    /**
     * Buffer polyfill for browser
     */
    Buffer: Buffer,
  }

  /**
   * Keys related utils
   */
  keys = {
    mnemonicGenerate: (length: 12 | 15 | 24 = 24): string => {
      return Bip39.generateMnemonic((32 * length) / 3)
    },

    mnemonicValidate: (mnemonic: string): boolean => {
      return Bip39.validateMnemonic(mnemonic)
    },

    mnemonicToXprvKey: (mnemonic: string, password?: string): string => {
      return CML.Bip32PrivateKey.from_bip39_entropy(
        this.misc.fromHex(Bip39.mnemonicToEntropy(mnemonic)),
        password ? new TextEncoder().encode(password) : new Uint8Array()
      ).to_bech32()
    },

    xprvKeyGenerate: (): string => {
      return CML.Bip32PrivateKey.generate_ed25519_bip32().to_bech32()
    },

    xprvKeyValidate: (xprvKey: string): boolean => {
      try {
        CML.Bip32PrivateKey.from_bech32(xprvKey).to_bech32()
        return true
      } catch {
        return false
      }
    },

    xprvKeyToXpubKey: (
      xprvKey: string,
      accountPath?: CW3Types.AccountDerivationPath,
      addressPath?: CW3Types.AddressDerivationPath
    ): string => {
      let key = CML.Bip32PrivateKey.from_bech32(xprvKey)
      if (accountPath) {
        for (const index of accountPath) {
          key = key.derive(this.misc.harden(index))
        }
      }
      if (addressPath) {
        for (const index of addressPath) {
          key = key.derive(index)
        }
      }
      return key.to_public().to_bech32()
    },

    xprvToVrfKey: (
      xprvKey: string,
      accountPath?: CW3Types.AccountDerivationPath,
      addressPath?: CW3Types.AddressDerivationPath
    ): string => {
      let key = CML.Bip32PrivateKey.from_bech32(xprvKey)
      if (accountPath) {
        for (const index of accountPath) {
          key = key.derive(this.misc.harden(index))
        }
      }
      if (addressPath) {
        for (const index of addressPath) {
          key = key.derive(index)
        }
      }
      return key.to_raw_key().to_bech32()
    },

    xvkKeyToXpubKey: (xvkKey: string): string => {
      return Bech32.bech32.encode("xpub", Bech32.bech32.decode(xvkKey, 118).words, 114)
    },

    xpubKeyValidate: (pubKey: string): boolean => {
      try {
        CML.Bip32PublicKey.from_bech32(pubKey)
        return true
      } catch {
        return false
      }
    },
  }

  /**
   * Address related utils
   */
  address = {
    validateAddress: (addrBech32: string): boolean => {
      try {
        CML.Address.from_bech32(addrBech32)
        return true
      } catch {
        return false
      }
    },

    getNetwork: (addrBech32: string): CW3Types.NetworkId | undefined => {
      try {
        return CML.Address.from_bech32(addrBech32).network_id() as CW3Types.NetworkId
      } catch {
        return undefined
      }
    },

    deriveBase: (
      xpubKey: string,
      addressDerivationPath: CW3Types.AddressDerivationPath,
      netoworkId: CW3Types.NetworkId
    ): string => {
      const paymentKeyHash = CML.Bip32PublicKey.from_bech32(xpubKey)
        .derive(addressDerivationPath[0])
        .derive(addressDerivationPath[1])
        .to_raw_key()
        .hash()
      const stakeKeyHash = CML.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()
      return CML.BaseAddress.new(
        netoworkId,
        CML.Credential.new_pub_key(paymentKeyHash),
        CML.Credential.new_pub_key(stakeKeyHash)
      )
        .to_address()
        .to_bech32()
    },

    deriveEnterprise: (
      xpubKey: string,
      addressDerivationPath: CW3Types.AddressDerivationPath,
      netoworkId: CW3Types.NetworkId
    ): string => {
      const paymentKeyHash = CML.Bip32PublicKey.from_bech32(xpubKey)
        .derive(addressDerivationPath[0])
        .derive(addressDerivationPath[1])
        .to_raw_key()
        .hash()
      return CML.EnterpriseAddress.new(netoworkId, CML.Credential.new_pub_key(paymentKeyHash)).to_address().to_bech32()
    },

    deriveStaking: (xpubKey: string, netoworkId: CW3Types.NetworkId): string => {
      const stakeKeyHash = CML.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()
      return CML.RewardAddress.new(netoworkId, CML.Credential.new_pub_key(stakeKeyHash)).to_address().to_bech32()
    },

    getStakingAddress: (addrBech32: string): string => {
      const address = CML.Address.from_bech32(addrBech32)
      const stakingCred = address.staking_cred()
      return CML.RewardAddress.new(address.network_id(), stakingCred).to_address().to_bech32()
    },

    getCredentials: (addrBech32: string): CW3Types.AddressPublicCredentials => {
      const address = CML.Address.from_bech32(addrBech32)
      const kind = address.kind() as 0 | 1 | 2 | 3 | 4
      const type = {
        0: "base",
        1: "pointer",
        2: "enterprise",
        3: "reward",
        4: "byron",
      }[kind] as CW3Types.AddressType
      if (type === "base") {
        return {
          type,
          paymentCred:
            address.payment_cred()?.kind() === 0
              ? {
                  type: "key",
                  hash: address.payment_cred()?.as_pub_key()?.to_hex(),
                }
              : {
                  type: "script",
                  hash: address.payment_cred()?.as_script().to_hex(),
                },
          stakingCred:
            address.staking_cred()?.kind() === 0
              ? {
                  type: "key",
                  hash: address.staking_cred()?.as_pub_key()?.to_hex(),
                }
              : {
                  type: "script",
                  hash: address.staking_cred()?.as_script().to_hex(),
                },
        }
      }
      if (type === "pointer") {
        return {
          type,
          paymentCred:
            address.payment_cred()?.kind() === 0
              ? {
                  type: "key",
                  hash: address.payment_cred()?.as_pub_key()?.to_hex(),
                }
              : {
                  type: "script",
                  hash: address.payment_cred()?.as_script().to_hex(),
                },
        }
      }
      if (type === "enterprise") {
        return {
          type,
          paymentCred:
            address.payment_cred()?.kind() === 0
              ? {
                  type: "key",
                  hash: address.payment_cred()?.as_pub_key()?.to_hex(),
                }
              : {
                  type: "script",
                  hash: address.payment_cred()?.as_script().to_hex(),
                },
        }
      }
      if (type === "reward") {
        return {
          type,
          stakingCred:
            address.payment_cred()?.kind() === 0
              ? {
                  type: "key",
                  hash: address.payment_cred()?.as_pub_key()?.to_hex(),
                }
              : {
                  type: "script",
                  hash: address.payment_cred()?.as_script().to_hex(),
                },
        }
      }
      if (type === "byron") {
        return {
          type,
        }
      }
    },

    getShelleyOrByronAddress: (addrBech32: string): CML.Address => {
      try {
        return CML.Address.from_bech32(addrBech32)
      } catch {
        return CML.ByronAddress.from_base58(addrBech32).to_address()
      }
    },
  }

  /**
   * Account related utils
   */
  account = {
    checksum: (
      xpubKey: string
    ): {
      checksumId: string
      checksumImage: string
    } => {
      return walletChecksum(xpubKey)
    },

    getDetailsFromXpub: (
      xpubKey: string,
      addressDerivationPath: CW3Types.AddressDerivationPath,
      netoworkId: CW3Types.NetworkId
    ): {
      paymentAddress: string
      paymentCred: string
      stakingAddress: string
      stakingCred: string
    } => {
      const paymentAddress = this.address.deriveBase(xpubKey, addressDerivationPath, netoworkId)
      const { paymentCred, stakingCred } = this.address.getCredentials(paymentAddress)
      const stakingAddress = this.address.getStakingAddress(paymentAddress)

      return {
        paymentAddress,
        paymentCred: paymentCred.hash,
        stakingAddress,
        stakingCred: stakingCred.hash,
      }
    },
    getBalanceFromUtxos: (utxos: CW3Types.Utxo[]): CW3Types.Balance => {
      const balance: CW3Types.Balance = {
        value: BigInt(0),
        assets: [],
      }

      utxos.forEach((utxo) => {
        balance.value += utxo.value
        utxo.assets.forEach((asset) => {
          const existingAsset = balance.assets.find(
            (a) => a.policyId + a.assetName === asset.policyId + asset.assetName
          )
          if (existingAsset) {
            existingAsset.quantity += asset.quantity
          } else {
            balance.assets.push({
              ...asset,
              fingerprint: this.asset.getFingerprint(asset.policyId, asset.assetName),
              assetNameAscii: this.asset.assetNameToAssetNameAscii(asset.assetName),
            })
          }
        })
      })

      return balance
    },
  }

  /**
   * Asset related utils
   */
  asset = {
    getFingerprint: (policyId: string, assetName?: string): string => {
      const readablePart = "asset"
      const hashBuffer = Blake2b(20)
        .update(new Uint8Array([...Buffer.from(policyId, "hex"), ...Buffer.from(assetName || "", "hex")]))
        .digest("binary")
      const words = Bech32.bech32.toWords(hashBuffer)
      const fingerprint = Bech32.bech32.encode(readablePart, words)
      return fingerprint
    },
    assetNameToAssetNameAscii: (assetName: string): string => {
      return Buffer.from(assetName, "hex").toString("utf-8")
    },
  }

  /**
   * TX related utils
   */
  tx = {
    createCostModels: (costModels: CW3Types.CostModels): CML.CostModels => {
      return CML.CostModels.from_json(
        JSON.stringify({
          0: costModels.PlutusV1,
          1: costModels.PlutusV2,
          2: costModels.PlutusV3,
        })
      )
    },

    getTxBuilder: (protocolParams: CW3Types.ProtocolParameters): CML.TransactionBuilder => {
      const pp = protocolParams
      const txBuilderConfig = CML.TransactionBuilderConfigBuilder.new()
        .fee_algo(CML.LinearFee.new(BigInt(pp.minFeeA), BigInt(pp.minFeeB), BigInt(pp.minFeeRefScriptCostPerByte)))
        .pool_deposit(BigInt(pp.poolDeposit))
        .key_deposit(BigInt(pp.keyDeposit))
        .coins_per_utxo_byte(BigInt(pp.coinsPerUtxoByte))
        .max_tx_size(pp.maxTxSize)
        .max_value_size(pp.maxValSize)
        .collateral_percentage(pp.collateralPercentage)
        .max_collateral_inputs(pp.maxCollateralInputs)
        .ex_unit_prices(
          CML.ExUnitPrices.new(
            CML.Rational.new(BigInt(pp.priceMem * 100_000_000), 100_000_000n),
            CML.Rational.new(BigInt(pp.priceStep * 100_000_000), 100_000_000n)
          )
        )
        .prefer_pure_change(true)
        .cost_models(this.tx.createCostModels(pp.costModels))
        .build()

      return CML.TransactionBuilder.new(txBuilderConfig)
    },

    assetsToValue: (value?: CW3Types.Value, assets?: CW3Types.Asset[]): CML.Value => {
      const multiAsset = CML.MultiAsset.new()

      if (assets) {
        for (const asset of assets) {
          const policyId = CML.ScriptHash.from_hex(asset.policyId)
          const assetName = CML.AssetName.from_raw_bytes(this.misc.fromHex(asset.assetName || ""))
          const policyAssets = multiAsset.get_assets(policyId) ?? CML.MapAssetNameToCoin.new()
          policyAssets.insert(assetName, asset.quantity)
          multiAsset.insert_assets(policyId, policyAssets)
        }
      }

      return CML.Value.new(value || 0n, multiAsset)
    },

    utxoToCore: (utxo: CW3Types.Utxo): CML.TransactionUnspentOutput => {
      return CML.TransactionUnspentOutput.new(
        this.tx.utxoToTransactionInput(utxo),
        this.tx.utxoToTransactionOutput(utxo)
      )
    },

    utxoToTransactionInput: (utxo: CW3Types.Utxo): CML.TransactionInput => {
      return CML.TransactionInput.new(CML.TransactionHash.from_hex(utxo.transaction.id), BigInt(utxo.index))
    },

    utxoToTransactionOutput: (utxo: CW3Types.Utxo): CML.TransactionOutput => {
      const value = this.tx.assetsToValue(utxo.value, utxo.assets)
      const outputBuilder = this.tx.outputToTransactionOutputBuilder(
        {
          address: utxo.address,
          value: utxo.value,
          assets: utxo.assets,
        },
        utxo.datum
          ? {
              type: utxo.datumType,
              datum: utxo.datum,
            }
          : undefined,
        utxo.script || undefined
      )
      return outputBuilder.next().with_value(value).build().output()
    },

    outputToTransactionOutputBuilder: (
      output: CW3Types.Output,
      datum?: CW3Types.DatumOutput,
      script?: CW3Types.Script
    ): CML.TransactionOutputBuilder => {
      const address = this.address.getShelleyOrByronAddress(output.address)
      let outputBuilder = CML.TransactionOutputBuilder.new().with_address(address)
      if (datum) {
        if (datum.type === "inline") {
          const data = CML.PlutusData.from_cbor_hex(datum.datum)
          const datumOption = CML.DatumOption.new_datum(data)
          outputBuilder = outputBuilder.with_data(datumOption)
        }
        if (datum.type === "hash") {
          // TODO: Check if hash datums is set correctly in the UTXO (witness set)
          const data = CML.PlutusData.from_cbor_hex(datum.datum)
          outputBuilder = outputBuilder.with_communication_data(data)
        }
      }
      return script ? outputBuilder.with_reference_script(this.script.scriptToScriptRef(script)) : outputBuilder
    },

    discoverOwnUsedTxKeyHashes: (tx: CML.Transaction, ownKeyHashes: string[], ownUtxos: CW3Types.Utxo[]): string[] => {
      const usedKeyHashes: string[] = []
      const body = tx.body()
      const inputs = body.inputs()
      const collaterals = body.collateral_inputs()
      const certs = body.certs()
      const withdrawals = body.withdrawals()
      const signers = body.required_signers()
      const scripts = tx.witness_set().native_scripts()

      if (inputs && inputs.len() > 0) {
        for (let i = 0; i < inputs.len(); i++) {
          const input = inputs.get(i)
          const txId = input.transaction_id().to_hex()
          const txIndex = Number(input.index())
          const utxo = ownUtxos.find((utxo) => utxo.transaction.id === txId && utxo.index === txIndex)
          if (utxo) {
            const { paymentCred } = this.address.getCredentials(utxo.address)
            usedKeyHashes.push(paymentCred.hash)
          }
        }
      }

      if (collaterals && collaterals.len() > 0) {
        for (let i = 0; i < collaterals.len(); i++) {
          const input = collaterals.get(i)
          const txId = input.transaction_id().to_hex()
          const txIndex = Number(input.index())
          const utxo = ownUtxos.find((utxo) => utxo.transaction.id === txId && utxo.index === txIndex)
          if (utxo) {
            const { paymentCred } = this.address.getCredentials(utxo.address)
            usedKeyHashes.push(paymentCred.hash)
          }
        }
      }

      if (certs && certs.len() > 0) {
        for (let i = 0; i < certs.len(); i++) {
          const cert = certs.get(i)
          switch (cert.kind()) {
            case 0:
              // Not needed for registration
              break
            case 1: {
              const credential = cert.as_stake_deregistration()?.stake_credential()
              if (credential?.kind() === 0) {
                usedKeyHashes.push(credential.as_pub_key()?.to_hex())
              }
              if (credential?.kind() === 0) {
                usedKeyHashes.push(credential.as_script()?.to_hex())
              }
              break
            }
            case 2: {
              const credential = cert.as_stake_delegation()?.stake_credential()
              if (credential?.kind() === 0) {
                usedKeyHashes.push(credential.as_pub_key()?.to_hex())
              }
              if (credential?.kind() === 1) {
                usedKeyHashes.push(credential.as_script()?.to_hex())
              }
              break
            }
            case 3: {
              const poolParams = cert.as_pool_registration()?.pool_params()!
              const owners = poolParams?.pool_owners()
              if (!owners) break
              for (let i = 0; i < owners.len(); i++) {
                const keyHash = owners.get(i).to_hex()
                usedKeyHashes.push(keyHash)
              }
              const operator = poolParams.operator().to_hex()
              usedKeyHashes.push(operator)
              break
            }
            case 4: {
              const operator = cert.as_pool_retirement()?.pool().to_hex()
              usedKeyHashes.push(operator)
              break
            }
            case 6: {
              const credential = cert.as_unreg_cert()?.stake_credential()
              if (credential) {
                usedKeyHashes.push(credential.to_cbor_hex())
              }
              break
            }

            default:
              break
          }
        }
      }

      if (withdrawals && withdrawals.len() > 0) {
        const rewardAddresses = withdrawals.keys()
        for (let i = 0; i < rewardAddresses.len(); i++) {
          const credential = rewardAddresses.get(i).payment()
          if (credential.kind() === 0) {
            usedKeyHashes.push(credential.as_pub_key()?.to_hex())
          }
          if (credential.kind() === 1) {
            usedKeyHashes.push(credential.as_script()?.to_hex())
          }
        }
      }

      if (signers && signers.len() > 0) {
        for (let i = 0; i < signers.len(); i++) {
          usedKeyHashes.push(signers.get(i).to_hex())
        }
      }

      function keyHashFromScript(scripts: CML.NativeScriptList) {
        for (let i = 0; i < scripts.len(); i++) {
          const script = scripts.get(i)
          if (script.kind() === 0) {
            const keyHash = script.as_script_pubkey()?.ed25519_key_hash().to_hex()
            usedKeyHashes.push(keyHash)
          }
          if (script.kind() === 1) {
            keyHashFromScript(script.as_script_all()!.native_scripts())
            return
          }
          if (script.kind() === 2) {
            keyHashFromScript(script.as_script_any()!.native_scripts())
            return
          }
          if (script.kind() === 3) {
            keyHashFromScript(script.as_script_n_of_k()!.native_scripts())
            return
          }
        }
      }
      if (scripts && scripts.len() > 0) keyHashFromScript(scripts)

      return usedKeyHashes.filter((hash) => ownKeyHashes.includes(hash))
    },
  }

  /**
   * Script related utils
   */
  script = {
    scriptToScriptRef: (script: CW3Types.Script): CML.Script => {
      switch (script.language) {
        case "Native":
          return CML.Script.new_native(CML.NativeScript.from_cbor_hex(script.script))
        case "PlutusV1":
          return CML.Script.new_plutus_v1(
            CML.PlutusV1Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        case "PlutusV2":
          return CML.Script.new_plutus_v2(
            CML.PlutusV2Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        case "PlutusV3":
          return CML.Script.new_plutus_v3(
            CML.PlutusV3Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        default:
          throw new Error("scriptToScriptRef: Wrong script language")
      }
    },

    scriptToAddress: (
      script: CW3Types.Script,
      netoworkId: CW3Types.NetworkId,
      stakeCredential?: CW3Types.Credential
    ): string => {
      const validatorHash = this.script.scriptToScriptHash(script)
      if (stakeCredential) {
        return CML.BaseAddress.new(
          netoworkId,
          CML.Credential.new_script(CML.ScriptHash.from_hex(validatorHash)),
          stakeCredential.type === "key"
            ? CML.Credential.new_pub_key(CML.Ed25519KeyHash.from_hex(stakeCredential.hash))
            : CML.Credential.new_script(CML.ScriptHash.from_hex(stakeCredential.hash))
        )
          .to_address()
          .to_bech32(undefined)
      } else {
        return CML.EnterpriseAddress.new(netoworkId, CML.Credential.new_script(CML.ScriptHash.from_hex(validatorHash)))
          .to_address()
          .to_bech32(undefined)
      }
    },

    scriptToPlutusScript: (script: CW3Types.Script): CML.PlutusScript => {
      switch (script.language) {
        case "PlutusV1":
          return CML.PlutusScript.from_v1(
            CML.PlutusV1Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        case "PlutusV2":
          return CML.PlutusScript.from_v2(
            CML.PlutusV2Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        case "PlutusV3":
          return CML.PlutusScript.from_v3(
            CML.PlutusV3Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
        default:
          throw new Error("scriptToPlutusScript: Wrong script language")
      }
    },

    scriptToScriptHash: (script: CW3Types.Script): string => {
      switch (script.language) {
        case "Native":
          return CML.NativeScript.from_cbor_hex(script.script).hash().to_hex()
        case "PlutusV1":
          return CML.PlutusScript.from_v1(
            CML.PlutusV1Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
            .hash()
            .to_hex()
        case "PlutusV2":
          return CML.PlutusScript.from_v2(
            CML.PlutusV2Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
            .hash()
            .to_hex()
        case "PlutusV3":
          return CML.PlutusScript.from_v3(
            CML.PlutusV3Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script.script))
          )
            .hash()
            .to_hex()
        default:
          throw new Error("scriptToScriptHash: Wrong script language")
      }
    },

    partialPlutusWitness: (script: CML.PlutusScript, redeemer: string): CML.PartialPlutusWitness => {
      return CML.PartialPlutusWitness.new(
        CML.PlutusScriptWitness.new_script(script),
        CML.PlutusData.from_cbor_hex(redeemer)
      )
    },

    applyDoubleCborEncoding: (script: string): string => {
      try {
        this.libs.Cborg.decode(this.libs.Cborg.decode(this.misc.fromHex(script)))
        return script
      } catch {
        return this.misc.toHex(this.libs.Cborg.encode(this.misc.fromHex(script)))
      }
    },

    nativeScriptFromJson: (
      json: CW3Types.NativeConfig
    ): {
      policyId: string
      script: CW3Types.Script
    } => {
      const parseNativeScript = (json: CW3Types.NativeConfig) => {
        switch (json.type) {
          case "sig":
            return CML.NativeScript.new_script_pubkey(CML.Ed25519KeyHash.from_hex(json.keyHash))
          case "before":
            return CML.NativeScript.new_script_invalid_hereafter(BigInt(json.slot))
          case "after":
            return CML.NativeScript.new_script_invalid_before(BigInt(json.slot))
          case "all": {
            const nativeList = CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return CML.NativeScript.new_script_all(nativeList)
          }
          case "any": {
            const nativeList = CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return CML.NativeScript.new_script_any(nativeList)
          }
          case "atLeast": {
            const nativeList = CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return CML.NativeScript.new_script_n_of_k(BigInt(json.required), nativeList)
          }
        }
      }
      const script: CW3Types.Script = {
        language: "Native",
        script: parseNativeScript(json).to_cbor_hex(),
      }
      const policyId = this.script.scriptToScriptHash(script)
      return {
        policyId,
        script,
      }
    },

    applyParamsToScript: <T extends unknown[] = PlutusData[]>(
      plutusScript: string,
      params: CW3Types.Exact<[...T]>,
      type?: T
    ): string => {
      const p = (type ? PlutusData().castTo<T>(params, type) : params) as PlutusData[]
      return this.misc.toHex(
        UPLC.apply_params_to_script(this.misc.fromHex(PlutusData().to(p)), this.misc.fromHex(plutusScript))
      )
    },
  }

  /**
   * Time related utils
   */
  time = {
    unixTimeToSlot: (unixTime: number, slotConfig: CW3Types.SlotConfig): number => {
      const timePassed = unixTime - slotConfig.zeroTime
      const slotsPassed = Math.floor(timePassed / slotConfig.slotDuration)
      return slotsPassed + slotConfig.zeroSlot
    },

    slotToUnixTime: (slot: number, slotConfig: CW3Types.SlotConfig): number => {
      const msAfterBegin = (slot - slotConfig.zeroSlot) * slotConfig.slotDuration
      return slotConfig.zeroTime + msAfterBegin
    },
  }

  /**
   * Miscellaneous utils
   */
  misc = {
    harden: (num: number): number => {
      return 0x80000000 + num
    },

    fromHex: (hex: string): Uint8Array => {
      return new Uint8Array(Buffer.from(hex, "hex"))
    },

    toHex: (bytes: Uint8Array): string => {
      return Buffer.from(bytes).toString("hex")
    },

    toStringFromHex(hex: string): string {
      return Buffer.from(hex, "hex").toString()
    },

    fromStringToHex(text: string): string {
      return Buffer.from(text).toString("hex")
    },

    encryptDataWithPass: (data: string, password: string): string => {
      return CML.emip3_encrypt_with_password(
        Buffer.from(password).toString("hex"),
        Buffer.from(this.misc.randomBytes(32)).toString("hex"),
        Buffer.from(this.misc.randomBytes(12)).toString("hex"),
        Buffer.from(data).toString("hex")
      )
    },

    decryptDataWithPass: (data: string, password: string): string => {
      return Buffer.from(CML.emip3_decrypt_with_password(Buffer.from(password).toString("hex"), data), "hex").toString()
    },

    randomBytes: (length: number): Uint8Array => {
      if (typeof window !== "undefined" && window.crypto) {
        const bytes = new Uint8Array(length)
        window.crypto.getRandomValues(bytes)
        return bytes
      } else {
        const { randomBytes } = require("crypto")
        return Uint8Array.from(randomBytes(length))
      }
    },
  }
}
