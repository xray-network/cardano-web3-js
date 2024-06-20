import { Buffer } from "buffer"
import * as Bech32 from "bech32"
import Blake2b from "blake2b"
import * as Bip39 from "./bip39"
import walletChecksum from "./cip4"
import { Data, Constr } from "./data"
import * as T from "../types"
import { signData, verifyData } from "./message"
import { DEFAULT_ADDRESS_DERIVATION_PATH } from "src/config"

export class Utils {
  private cw3: T.CardanoWeb3
  Data: ReturnType<typeof Data>
  Constr: typeof Constr
  Message: {
    signData: T.OmitFirstArg<typeof signData>
    verifyData: T.OmitFirstArg<typeof verifyData>
  }

  constructor(cw3: T.CardanoWeb3) {
    this.cw3 = cw3
    this.Data = Data(cw3)
    this.Constr = Constr
    this.Message = {
      signData: signData.bind(undefined, cw3),
      verifyData: verifyData.bind(undefined, cw3),
    }
  }

  /**
   * Bech32 encoding and decoding library
   */
  Bech32 = Bech32

  /**
   * Blake2b hashing library
   */
  Blake2b = Blake2b

  /**
   * Bip39 mnemonic library (only english words supported)
   */
  Bip39 = Bip39

  /**
   * Buffer polyfill for browser
   */
  Buffer = Buffer

  /**
   * Keys related utils
   */
  keys = {
    mnemonicGenerate: (length: 12 | 15 | 24 = 24) => {
      return Bip39.generateMnemonic((32 * length) / 3)
    },

    mnemonicValidate: (mnemonic: string) => {
      return Bip39.validateMnemonic(mnemonic)
    },

    mnemonicToXprvKey: (mnemonic: string, password?: string) => {
      return this.cw3.CML.Bip32PrivateKey.from_bip39_entropy(
        this.misc.fromHex(Bip39.mnemonicToEntropy(mnemonic)),
        password ? new TextEncoder().encode(password) : new Uint8Array()
      ).to_bech32()
    },

    xprvKeyGenerate: () => {
      return this.cw3.CML.Bip32PrivateKey.generate_ed25519_bip32().to_bech32()
    },

    xprvKeyValidate: (xprvKey: string) => {
      try {
        this.cw3.CML.Bip32PrivateKey.from_bech32(xprvKey).to_bech32()
        return true
      } catch {
        return false
      }
    },

    xprvKeyToXpubKey: (
      xprvKey: string,
      accountPath?: T.AccountDerivationPath,
      addressPath?: T.AddressDerivationPath
    ) => {
      let key = this.cw3.CML.Bip32PrivateKey.from_bech32(xprvKey)
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

    xprvToVrfKey: (xprvKey: string, accountPath?: T.AccountDerivationPath, addressPath?: T.AddressDerivationPath) => {
      let key = this.cw3.CML.Bip32PrivateKey.from_bech32(xprvKey)
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

    xvkKeyToXpubKey: (xvkKey: string) => {
      return Bech32.bech32.encode("xpub", Bech32.bech32.decode(xvkKey, 118).words, 114)
    },

    xpubKeyValidate: (pubKey: string) => {
      try {
        this.cw3.CML.Bip32PublicKey.from_bech32(pubKey)
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
    deriveBase: (xpubKey: string, addressDerivationPath: T.AddressDerivationPath) => {
      const paymentKeyHash = this.cw3.CML.Bip32PublicKey.from_bech32(xpubKey)
        .derive(addressDerivationPath[0])
        .derive(addressDerivationPath[1])
        .to_raw_key()
        .hash()
      const stakeKeyHash = this.cw3.CML.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()
      return this.cw3.CML.BaseAddress.new(
        this.cw3.network.id,
        this.cw3.CML.Credential.new_pub_key(paymentKeyHash),
        this.cw3.CML.Credential.new_pub_key(stakeKeyHash)
      )
        .to_address()
        .to_bech32()
    },

    deriveEnterprise: (xpubKey: string, addressDerivationPath: T.AddressDerivationPath) => {
      const paymentKeyHash = this.cw3.CML.Bip32PublicKey.from_bech32(xpubKey)
        .derive(addressDerivationPath[0])
        .derive(addressDerivationPath[1])
        .to_raw_key()
        .hash()
      return this.cw3.CML.EnterpriseAddress.new(
        this.cw3.network.id,
        this.cw3.CML.Credential.new_pub_key(paymentKeyHash)
      )
        .to_address()
        .to_bech32()
    },

    deriveStaking: (xpubKey: string) => {
      const stakeKeyHash = this.cw3.CML.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()
      return this.cw3.CML.RewardAddress.new(this.cw3.network.id, this.cw3.CML.Credential.new_pub_key(stakeKeyHash))
        .to_address()
        .to_bech32()
    },

    getStakingAddress: (addrBech32: string) => {
      const address = this.cw3.CML.Address.from_bech32(addrBech32)
      const stakingCred = address.staking_cred()
      return this.cw3.CML.RewardAddress.new(address.network_id(), stakingCred).to_address().to_bech32()
    },

    getPublicCredentials: (addrBech32: string): T.AddressPublicCredentials => {
      const address = this.cw3.CML.Address.from_bech32(addrBech32)
      const kind = address.kind() as 0 | 1 | 2 | 3 | 4
      const type = {
        0: "base",
        1: "pointer",
        2: "enterprise",
        3: "reward",
        4: "byron",
      }[kind] as T.AddressType
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
    },

    getShelleyOrByronAddress: (addrBech32: string) => {
      try {
        return this.cw3.CML.Address.from_bech32(addrBech32)
      } catch {
        return this.cw3.CML.ByronAddress.from_base58(addrBech32).to_address()
      }
    },
  }

  /**
   * Account related utils
   */
  account = {
    checksum: (xpubKey: string) => {
      return walletChecksum(xpubKey)
    },

    getDetailsFromXpub: (xpubKey: string, addressDerivationPath: T.AddressDerivationPath) => {
      const paymentAddress = this.address.deriveBase(xpubKey, addressDerivationPath)
      const { paymentCred, stakingCred } = this.address.getPublicCredentials(paymentAddress)
      const stakingAddress = this.address.getStakingAddress(paymentAddress)

      return {
        paymentAddress,
        paymentCred: paymentCred.hash,
        stakingAddress,
        stakingCred: stakingCred.hash,
      }
    },
    getBalanceFromUtxos: (utxos: T.Utxo[]): T.Balance => {
      const balance: T.Balance = {
        lovelace: BigInt(0),
        assets: [],
      }

      utxos.forEach((utxo) => {
        balance.lovelace += utxo.value
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
    getFingerprint: (policyId: string, assetName?: string) => {
      const readablePart = "asset"
      const hashBuffer = Blake2b(20)
        .update(new Uint8Array([...Buffer.from(policyId, "hex"), ...Buffer.from(assetName || "", "hex")]))
        .digest("binary")
      const words = Bech32.bech32.toWords(hashBuffer)
      const fingerprint = Bech32.bech32.encode(readablePart, words)
      return fingerprint
    },
  }

  /**
   * TX related utils
   */
  tx = {
    createCostModels: (costModels: T.CostModels) => {
      const models = this.cw3.CML.CostModels.new()
      if (costModels["PlutusV1"]) {
        const plutusV1 = this.cw3.CML.IntList.new()
        costModels["PlutusV1"].forEach((value) => plutusV1.add(this.cw3.CML.Int.new(BigInt(value))))
        models.set_plutus_v1(plutusV1)
      }
      if (costModels["PlutusV2"]) {
        const plutusV2 = this.cw3.CML.IntList.new()
        costModels["PlutusV2"].forEach((value) => plutusV2.add(this.cw3.CML.Int.new(BigInt(value))))
        models.set_plutus_v2(plutusV2)
      }
      if (costModels["PlutusV3"]) {
        const plutusV3 = this.cw3.CML.IntList.new()
        costModels["PlutusV3"].forEach((value) => plutusV3.add(this.cw3.CML.Int.new(BigInt(value))))
        models.set_plutus_v3(plutusV3)
      }
      return models
    },

    getTxBuilder: (protocolParams: T.ProtocolParameters) => {
      const pp = protocolParams
      const txBuilderConfig = this.cw3.CML.TransactionBuilderConfigBuilder.new()
        .fee_algo(this.cw3.CML.LinearFee.new(BigInt(pp.minFeeA), BigInt(pp.minFeeB)))
        .pool_deposit(BigInt(pp.poolDeposit))
        .key_deposit(BigInt(pp.keyDeposit))
        .coins_per_utxo_byte(BigInt(pp.coinsPerUtxoByte))
        .max_tx_size(pp.maxTxSize)
        .max_value_size(pp.maxValSize)
        .collateral_percentage(pp.collateralPercentage)
        .max_collateral_inputs(pp.maxCollateralInputs)
        .ex_unit_prices(
          this.cw3.CML.ExUnitPrices.new(
            this.cw3.CML.Rational.new(BigInt(pp.priceMem * 100_000_000), 100_000_000n),
            this.cw3.CML.Rational.new(BigInt(pp.priceStep * 100_000_000), 100_000_000n)
          )
        )
        .prefer_pure_change(true)
        .cost_models(this.tx.createCostModels(pp.costModels))
        .build()

      return this.cw3.CML.TransactionBuilder.new(txBuilderConfig)
    },

    assetsToValue: (value?: T.Lovelace, assets?: T.Asset[]) => {
      const multiAsset = this.cw3.CML.MultiAsset.new()

      if (assets) {
        for (const asset of assets) {
          const policyId = this.cw3.CML.ScriptHash.from_hex(asset.policyId)
          const assetName = this.cw3.CML.AssetName.from_bytes(this.misc.fromHex(asset.assetName || ""))
          const policyAssets = multiAsset.get_assets(policyId) ?? this.cw3.CML.MapAssetNameToCoin.new()
          policyAssets.insert(assetName, asset.quantity)
          multiAsset.insert_assets(policyId, policyAssets)
        }
      }

      return this.cw3.CML.Value.new(value || 0n, multiAsset)
    },

    utxoToCore: (utxo: T.Utxo) => {
      return this.cw3.CML.TransactionUnspentOutput.new(
        this.tx.utxoToTransactionInput(utxo),
        this.tx.utxoToTransactionOutput(utxo)
      )
    },

    utxoToTransactionInput: (utxo: T.Utxo) => {
      return this.cw3.CML.TransactionInput.new(
        this.cw3.CML.TransactionHash.from_hex(utxo.transaction.id),
        BigInt(utxo.index)
      )
    },

    utxoToTransactionOutput: (utxo: T.Utxo) => {
      const address = this.address.getShelleyOrByronAddress(utxo.address)
      const value = this.tx.assetsToValue(utxo.value, utxo.assets)
      const builder = this.cw3.CML.TransactionOutputBuilder.new().with_address(address)
      const builderWithDatum = (() => {
        if (utxo.datumHash && utxo.datumType === "witness") {
          return builder.with_data(this.cw3.CML.DatumOption.new_hash(this.cw3.CML.DatumHash.from_hex(utxo.datumHash)))
        }
        if (utxo.datumHash && utxo.datum && utxo.datumType === "inline") {
          return builder.with_data(
            this.cw3.CML.DatumOption.new_datum(this.cw3.CML.PlutusData.from_cbor_hex(utxo.datum))
          )
        }
        return builder
      })()
      const output = utxo.scriptHash
        ? builderWithDatum.with_reference_script(this.script.scriptToScriptRef(utxo.script)).next()
        : builderWithDatum.next()
      return output.with_value(value).build().output()
    },

    discoverOwnUsedTxKeyHashes: (tx: T.CML.Transaction, ownKeyHashes: string[], ownUtxos: T.Utxo[]) => {
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
            const { paymentCred } = this.cw3.utils.address.getPublicCredentials(utxo.address)
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
            const { paymentCred } = this.cw3.utils.address.getPublicCredentials(utxo.address)
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
              switch (credential?.kind()) {
                case 0:
                  usedKeyHashes.push(credential.as_pub_key()?.to_hex())
                  break
                case 1:
                  usedKeyHashes.push(credential.as_script()?.to_hex())
                  break
              }
              break
            }
            case 2: {
              const credential = cert.as_stake_delegation()?.stake_credential()
              if (credential?.kind() === 0) {
                const keyHash = credential.to_cbor_hex()
                usedKeyHashes.push(keyHash)
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

      function keyHashFromScript(scripts: T.CML.NativeScriptList) {
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

      return usedKeyHashes
    },
  }

  /**
   * Script related utils
   */
  script = {
    scriptToScriptRef: (script: T.Script) => {
      switch (script.language) {
        case "Native":
          return this.cw3.CML.Script.new_native(this.cw3.CML.NativeScript.from_cbor_hex(script.script))
        case "PlutusV1":
          return this.cw3.CML.Script.new_plutus_v1(
            this.cw3.CML.PlutusV1Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
        case "PlutusV2":
          return this.cw3.CML.Script.new_plutus_v2(
            this.cw3.CML.PlutusV2Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
        case "PlutusV3":
          return this.cw3.CML.Script.new_plutus_v3(
            this.cw3.CML.PlutusV3Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
        default:
          throw new Error("scriptToScriptRef: Wrong script language")
      }
    },

    scriptToScriptHash: (script: T.Script) => {
      switch (script.language) {
        case "Native":
          return this.cw3.CML.NativeScript.from_cbor_hex(script.script).hash().to_hex()
        case "PlutusV1":
          return this.cw3.CML.PlutusScript.from_v1(
            this.cw3.CML.PlutusV1Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
            .hash()
            .to_hex()
        case "PlutusV2":
          return this.cw3.CML.PlutusScript.from_v2(
            this.cw3.CML.PlutusV2Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
            .hash()
            .to_hex()
        case "PlutusV3":
          return this.cw3.CML.PlutusScript.from_v3(
            this.cw3.CML.PlutusV3Script.from_cbor_hex(this.script.applyDoubleCborEncoding(script))
          )
            .hash()
            .to_hex()
        default:
          throw new Error("scriptToScriptRef: Wrong script language")
      }
    },

    scriptToPlutusScript: (script: T.Script) => {
      switch (script.language) {
        case "PlutusV1":
          return this.cw3.CML.PlutusScript.from_v1(this.cw3.CML.PlutusV1Script.from_cbor_hex(script.script))
        case "PlutusV2":
          return this.cw3.CML.PlutusScript.from_v2(this.cw3.CML.PlutusV2Script.from_cbor_hex(script.script))
        case "PlutusV3":
          return this.cw3.CML.PlutusScript.from_v3(this.cw3.CML.PlutusV3Script.from_cbor_hex(script.script))
        default:
          throw new Error("scriptToPlutusScript: Wrong script language")
      }
    },

    partialPlutusWitness: (script: T.CML.PlutusScript, redeemer: string) => {
      return this.cw3.CML.PartialPlutusWitness.new(
        this.cw3.CML.PlutusScriptWitness.new_script(script),
        this.cw3.CML.PlutusData.from_cbor_hex(redeemer)
      )
    },

    applyDoubleCborEncoding: (script: T.Script) => {
      switch (script.language) {
        case "PlutusV1":
          try {
            return this.cw3.CML.PlutusV1Script.from_cbor_hex(
              this.cw3.CML.PlutusV1Script.from_cbor_hex(script.script).to_cbor_hex()
            ).to_cbor_hex()
          } catch {
            return this.cw3.CML.PlutusV1Script.from_cbor_hex(script.script).to_cbor_hex()
          }
        case "PlutusV2":
          try {
            return this.cw3.CML.PlutusV2Script.from_cbor_hex(
              this.cw3.CML.PlutusV2Script.from_cbor_hex(script.script).to_cbor_hex()
            ).to_cbor_hex()
          } catch {
            return this.cw3.CML.PlutusV2Script.from_cbor_hex(script.script).to_cbor_hex()
          }
        case "PlutusV3":
          try {
            return this.cw3.CML.PlutusV3Script.from_cbor_hex(
              this.cw3.CML.PlutusV3Script.from_cbor_hex(script.script).to_cbor_hex()
            ).to_cbor_hex()
          } catch {
            return this.cw3.CML.PlutusV3Script.from_cbor_hex(script.script).to_cbor_hex()
          }
        default:
          throw new Error("Error :: utils.applyDoubleCborEncoding() :: Wrong script language")
      }
    },

    nativeScriptFromJson: (
      json: T.NativeConfig
    ): {
      policyId: string
      script: T.Script
    } => {
      const parseNativeScript = (json: T.NativeConfig) => {
        switch (json.type) {
          case "sig":
            return this.cw3.CML.NativeScript.new_script_pubkey(this.cw3.CML.Ed25519KeyHash.from_hex(json.keyHash))
          case "before":
            return this.cw3.CML.NativeScript.new_script_invalid_hereafter(BigInt(json.slot))
          case "after":
            return this.cw3.CML.NativeScript.new_script_invalid_before(BigInt(json.slot))
          case "all": {
            const nativeList = this.cw3.CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return this.cw3.CML.NativeScript.new_script_all(nativeList)
          }
          case "any": {
            const nativeList = this.cw3.CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return this.cw3.CML.NativeScript.new_script_any(nativeList)
          }
          case "atLeast": {
            const nativeList = this.cw3.CML.NativeScriptList.new()
            json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
            return this.cw3.CML.NativeScript.new_script_n_of_k(BigInt(json.required), nativeList)
          }
        }
      }
      const script: T.Script = {
        language: "Native",
        script: parseNativeScript(json).to_cbor_hex(),
      }
      const policyId = this.script.scriptToScriptHash(script)
      return {
        policyId,
        script,
      }
    },

    applyParamsToScript: <T extends unknown[] = Data[]>(
      plutusScript: string,
      params: T.Exact<[...T]>,
      type?: T
    ): string => {
      const p = (type ? this.Data.castTo<T>(params, type) : params) as Data[]
      return this.misc.toHex(
        this.cw3.UPLC.apply_params_to_script(this.misc.fromHex(this.Data.to(p)), this.misc.fromHex(plutusScript))
      )
    },
  }

  /**
   * Time related utils
   */
  time = {
    unixTimeToSlot: (unixTime: number, config: T.SlotConfig) => {
      const timePassed = unixTime - config.zeroTime
      const slotsPassed = Math.floor(timePassed / config.slotDuration)
      return slotsPassed + config.zeroSlot
    },

    slotToUnixTime: (slot: number, config: T.SlotConfig) => {
      const msAfterBegin = (slot - config.zeroSlot) * config.slotDuration
      return config.zeroTime + msAfterBegin
    },
  }

  /**
   * Miscellaneous utils
   */
  misc = {
    harden: (num: number): number => {
      return 0x80000000 + num
    },

    fromHex: (hex: string) => {
      return Buffer.from(hex, "hex")
    },

    toHex: (bytes: Buffer | Uint8Array) => {
      return Buffer.from(bytes).toString("hex")
    },

    toStringFromHex(hex: string): string {
      return Buffer.from(hex, "hex").toString()
    },

    fromStringToHex(text: string): string {
      return Buffer.from(text).toString("hex")
    },

    encryptDataWithPass: (data: string, password: string) => {
      return this.cw3.CML.emip3_encrypt_with_password(
        Buffer.from(password).toString("hex"),
        Buffer.from(this.misc.randomBytes(32)).toString("hex"),
        Buffer.from(this.misc.randomBytes(12)).toString("hex"),
        Buffer.from(data).toString("hex")
      )
    },

    decryptDataWithPass: (data: string, password: string) => {
      return Buffer.from(
        this.cw3.CML.emip3_decrypt_with_password(Buffer.from(password).toString("hex"), data),
        "hex"
      ).toString()
    },

    randomBytes: (length: number) => {
      const bytes = new Uint8Array(length)
      for (let i = 0; i < length; i++) {
        bytes[i] = Math.floor(Math.random() * 256)
      }
      return bytes
    },
  }
}
