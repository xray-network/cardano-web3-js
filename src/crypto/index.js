/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2021, Ray Network <hello@rraayy.com>
 * https://rraayy.com, https://raywallet.io
 *
 * Copyright (c) 2018 EMURGO
 * Copyright (c) 2021 Tango-crypto
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 */

import { bech32 as Bech32 } from 'bech32'
import BigNumber from 'bignumber.js'
import Bip39 from 'bip39-light'

const Crypto = function Crypto(pkg, settings) {
  return (async () => {
    /**
     * Cardano Serialization Lib
     */
    this.Cardano = await import('@emurgo/cardano-serialization-lib-browser')

    /**
     * Lib proxies
     */

    this.Bech32 = Bech32
    this.Bip39 = Bip39
    this.BigNumber = BigNumber

    /**
     * Get Current Network
     */

    this.Network =
      settings.network === 'mainnet'
        ? this.Cardano.NetworkInfo.mainnet().network_id()
        : this.Cardano.NetworkInfo.testnet().network_id()

    /**
     * Protocol Parameters
     */

    const { protocolParams } = settings

    /**
     * Error Handler
     */

    const errorHandler =
      settings.errorHandler ||
      ((error) => {
        console.error(error)
      })

    /**
     * Errors
     */

    const ErrorMessages = {
      DEFAULT: 'An unspecified error has occurred',
      NOT_ENOUGH: 'Not enough funds to send a transaction',
      TOKENS_NOT_ENOUGH: 'Token output must be greater than 1',
      ADA_LESS_THAN_MIN: 'Minimum 1 ADA',
      ADA_NOT_NUMBER: 'Wrong ADA value',
      ADA_WRONG_VALUE: 'Wrong ADA value',
      ADDRESS_WRONG: 'Wrong Cardano address',
      NO_OUTPUTS: 'Transaction requires at least 1 output, but no output was added',
      NO_CHANGE: 'No change added even though it should be forced',
      ASSET_OVERFLOW: 'Maximum value of a token inside a UTXO exceeded (overflow)',
    }

    const ErrorException = (type) => {
      return new Error(type || ErrorMessages.DEFAULT)
    }

    /**
     * Add input results values
     */

    const AddInputResult = Object.freeze({
      // valid
      VALID: 0,
      // not worth the fee of adding it to input
      TOO_SMALL: 1,
      // token would overflow if added
      OVERFLOW: 2,
      // doesn't contribute to target
      NO_NEED: 3,
    })

    /**
     * Generate mnemonic
     * @param {number} length string length (words count)
     * @return {string} seed phrase
     */

    this.generateMnemonic = (length = 24) => {
      try {
        return Bip39.generateMnemonic((32 * length) / 3)
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Validate mnemonic
     * @param {string} mnemonic seed phrase
     * @return {boolean} is valid
     */

    this.validateMnemonic = (mnemonic) => {
      try {
        return !!mnemonic && Bip39.validateMnemonic(mnemonic)
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Get account info (private key, public key, reward address, account ID)
     * @param {string} mnemonic mnemonic seed phrase
     * @return {object}
     */

    this.getAccountKeys = (mnemonic) => {
      const { Cardano, Network, Utils } = this
      try {
        const harden = (num) => {
          return settings.harden + num
        }

        const entropy = Bip39.mnemonicToEntropy(mnemonic)
        const rootKey = Cardano.Bip32PrivateKey.from_bip39_entropy(
          Buffer.from(entropy, 'hex'),
          Buffer.from(''),
        )
        const privateKey = rootKey.derive(harden(1852)).derive(harden(1815)).derive(harden(0))
        const stakeKey = privateKey.derive(2).derive(0).to_public()
        const rewardAddress = Cardano.RewardAddress.new(
          Network,
          Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
        )

        const privateKeyBech32 = privateKey.to_bech32()
        const publicKeyBech32 = privateKey.to_public().to_bech32()
        const rewardAddressBech32 = rewardAddress.to_address().to_bech32()
        const accountId = Utils.bechToHex(rewardAddressBech32)

        return {
          privateKey: privateKeyBech32,
          publicKey: publicKeyBech32,
          rewardAddress: rewardAddressBech32,
          accountId: accountId.data.slice(2),
          accountIdFull: accountId.data,
        }
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Generate addresses array by Public Key
     * @param {string} publicKeyBech32 public key
     * @param {string} type external / internal / all derives
     * @param {number} page page size
     * @param {number} shift shifting addresses by page size
     * @return {array} addresses array
     */

    this.getAccountAddresses = (publicKeyBech32, page = 20, type = [0], shift = 0) => {
      const { Cardano, Network } = this

      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)

        const generateAddresses = (addressType) => {
          const tmpAddresses = []
          for (let i = 0 + page * shift; i < page + page * shift; i += 1) {
            const utxoPubKey = publicKey
              .derive(addressType) // 0 external / 1 internal
              .derive(i)
            const stakeKey = publicKey
              .derive(2) // chimeric
              .derive(0)
            const baseAddr = Cardano.BaseAddress.new(
              Network,
              Cardano.StakeCredential.from_keyhash(utxoPubKey.to_raw_key().hash()),
              Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            )
            tmpAddresses.push({
              address: baseAddr.to_address().to_bech32(),
              type: addressType,
              path: i,
            })
          }
          return tmpAddresses
        }

        return type.map((i) => generateAddresses(i)).flat(1)
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Validate Shelley Address
     * @param {string} address bech32 shelley address
     * @return {boolean} is valid
     */

    this.validateAddress = (address) => {
      const { Cardano } = this

      try {
        if (Cardano.ByronAddress.is_valid(address)) return 'byron'
        const shelleyAddress = Cardano.Address.from_bech32(address)
        if (Cardano.ByronAddress.from_address(shelleyAddress)) return 'byron'
        if (Cardano.BaseAddress.from_address(shelleyAddress)) return 'base'
        if (Cardano.PointerAddress.from_address(shelleyAddress)) return 'pointer'
        if (Cardano.EnterpriseAddress.from_address(shelleyAddress)) return 'enterprise'
        if (Cardano.RewardAddress.from_address(shelleyAddress)) return 'reward'
        return false
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    this.Utils = {
      /**
       * Bech to hex string converter
       * @param {string} str bech32 string
       * @return {string} hex string
       */
      bechToHex: (str) => {
        try {
          const tmp = Bech32.decode(str, 1000)
          return {
            prefix: tmp.prefix,
            data: Buffer.from(Bech32.fromWords(tmp.words)).toString('hex'),
          }
        } catch (error) {
          errorHandler(error)
          return false
        }
      },

      // parse tokens
      parseTokenList: (assets) => {
        if (assets == null) return []

        const result = []
        const hashes = assets.keys()

        for (let i = 0; i < hashes.len(); i += 1) {
          const policyId = hashes.get(i)
          const assetsForPolicy = assets.get(policyId)
          // eslint-disable-next-line
          if (assetsForPolicy == null) continue

          const policies = assetsForPolicy.keys()

          for (let j = 0; j < policies.len(); j += 1) {
            const assetName = policies.get(j)
            const amount = assetsForPolicy.get(assetName)
            // eslint-disable-next-line
            if (amount == null) continue

            const parsedQuantity = amount.to_str()
            const parsedName = Buffer.from(assetName.name()).toString('hex')
            const parsedPolicyId = Buffer.from(policyId.to_bytes()).toString('hex')
            const parsedAssetId = `${parsedPolicyId}${parsedName}`

            result.push({
              asset: {
                policyId: parsedPolicyId,
                assetId: parsedAssetId,
                assetName: parsedName,
              },
              quantity: parsedQuantity,
            })
          }
        }
        return result
      },

      // parse tcBody outputs
      parseOutputs: (txBody) => {
        const { Utils } = this

        const length = txBody.outputs().len()
        const result = []
        // eslint-disable-next-line
        for (let i = 0; i < length; i++) {
          const output = txBody.outputs().get(i)
          const transformed = {
            address: output.address().to_bech32(),
            value: output.amount().coin().to_str(),
            tokens: Utils.parseTokenList(output.amount().multiasset()),
          }
          result.push(transformed)
        }

        return result
      },

      // value from outputs (ada value/tokens) data
      cardanoValueFromTokens: (value, tokens = []) => {
        const { Cardano } = this

        const cardanoValue = Cardano.Value.new(Cardano.BigNum.from_str(value))

        if (tokens && tokens.length === 0) {
          return cardanoValue
        }

        const assets = Cardano.MultiAsset.new()
        tokens.forEach((token) => {
          const policyId = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const assetName = Cardano.AssetName.new(Buffer.from(token.asset.assetName || '', 'hex'))
          const quantity = Cardano.BigNum.from_str(token.quantity)

          const asset = assets.get(policyId) ?? Cardano.Assets.new()

          asset.insert(assetName, quantity)
          assets.insert(policyId, asset)
        })

        if (assets.len() > 0) {
          cardanoValue.set_multiasset(assets)
        }

        return cardanoValue
      },

      // value from mint (ada value/tokens) data
      cardanoValueFromMint: (value, tokens = []) => {
        const { Cardano } = this

        const cardanoValue = Cardano.Value.new(Cardano.BigNum.from_str(value))

        if (tokens && tokens.length === 0) {
          return cardanoValue
        }

        const assets = Cardano.MultiAsset.new()
        tokens.forEach((token) => {
          const policyId = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const assetName = Cardano.AssetName.new(Buffer.from(token.asset.assetName || ''))
          const quantity = Cardano.BigNum.from_str(token.quantity)

          const asset = assets.get(policyId) ?? Cardano.Assets.new()

          asset.insert(assetName, quantity)
          assets.insert(policyId, asset)
        })

        if (assets.len() > 0) {
          cardanoValue.set_multiasset(assets)
        }

        return cardanoValue
      },

      // value from utxo
      cardanoValueFromRemoteFormat: (utxo) => {
        const { Cardano } = this

        const cardanoValue = Cardano.Value.new(Cardano.BigNum.from_str(utxo.value))

        if (utxo.tokens.length === 0) {
          return cardanoValue
        }

        const assets = Cardano.MultiAsset.new()

        utxo.tokens.forEach((token) => {
          const policyId = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const assetName = Cardano.AssetName.new(Buffer.from(token.asset.assetName || '', 'hex'))
          const quantity = Cardano.BigNum.from_str(token.quantity)

          const policyContent = assets.get(policyId) ?? Cardano.Assets.new()

          policyContent.insert(assetName, quantity)
          assets.insert(policyId, policyContent)
        })

        if (assets.len() > 0) {
          cardanoValue.set_multiasset(assets)
        }

        return cardanoValue
      },

      // mint values for set_mint
      mint: (tokens) => {
        const { Cardano } = this

        const mint = Cardano.Mint.new()

        tokens.forEach((token) => {
          const scriptHash = Cardano.ScriptHash.from_bytes(Buffer.from(token.asset.policyId, 'hex'))
          const mintAssets = mint.get(scriptHash) ?? Cardano.MintAssets.new()
          mintAssets.insert(
            Cardano.AssetName.new(Buffer.from(token.asset.assetName || '')),
            Cardano.Int.new_i32(token.quantity),
          )
          mint.insert(scriptHash, mintAssets)
        })

        return mint
      },

      // process metadata
      metadata: (metadataInput) => {
        const { Cardano } = this

        const MetadateTypesEnum = {
          Number: 'int',
          String: 'string',
          Bytes: 'bytes',
          List: 'list',
          Map: 'map',
        }

        const getMetadataObject = (data) => {
          const result = {}
          const type = typeof data
          if (type === 'number') {
            result[MetadateTypesEnum.Number] = data
          } else if (type === 'string' && Buffer.byteLength(data, 'utf-8') <= 64) {
            result[MetadateTypesEnum.String] = data
          } else if (Buffer.isBuffer(data) && Buffer.byteLength(data, 'hex') <= 64) {
            result[MetadateTypesEnum.Bytes] = data.toString('hex')
          } else if (type === 'boolean') {
            result[MetadateTypesEnum.String] = data.toString()
          } else if (type === 'undefined') {
            result[MetadateTypesEnum.String] = 'undefined'
          } else if (Array.isArray(data)) {
            result[MetadateTypesEnum.List] = data.map((a) => getMetadataObject(a))
          } else if (type === 'object') {
            if (data) {
              result[MetadateTypesEnum.Map] = Object.keys(data).map((k) => {
                return {
                  k: getMetadataObject(k),
                  v: getMetadataObject(data[k]),
                }
              })
            } else {
              result[MetadateTypesEnum.String] = 'null'
            }
          }
          return result
        }

        const constructMetadata = (data) => {
          const metadata = {}

          if (Array.isArray(data)) {
            // eslint-disable-next-line
            for (let i = 0; i < data.length; i++) {
              const value = data[i]
              metadata[i] = getMetadataObject(value)
            }
          } else {
            const keys = Object.keys(data)
            // eslint-disable-next-line
            for (let i = 0; i < keys.length; i++) {
              const key = keys[i]
              if (Number.isInteger(Number(key))) {
                const index = parseInt(key, 10)
                metadata[index] = getMetadataObject(data[key])
              }
            }
          }
          return metadata
        }

        const getTransactionMetadatum = (value) => {
          if (Object.prototype.hasOwnProperty.call(value, MetadateTypesEnum.Number)) {
            return Cardano.TransactionMetadatum.new_int(
              Cardano.Int.new_i32(value[MetadateTypesEnum.Number]),
            )
          }
          if (Object.prototype.hasOwnProperty.call(value, MetadateTypesEnum.String)) {
            return Cardano.TransactionMetadatum.new_text(value[MetadateTypesEnum.String])
          }
          if (Object.prototype.hasOwnProperty.call(value, MetadateTypesEnum.Bytes)) {
            return Cardano.TransactionMetadatum.new_bytes(
              Buffer.from(value[MetadateTypesEnum.Bytes], 'hex'),
            )
          }
          if (Object.prototype.hasOwnProperty.call(value, MetadateTypesEnum.List)) {
            const list = value[MetadateTypesEnum.List]
            const metalist = Cardano.MetadataList.new()
            // eslint-disable-next-line
            for (let i = 0; i < list.length; i++) {
              metalist.add(getTransactionMetadatum(list[i]))
            }
            return Cardano.TransactionMetadatum.new_list(metalist)
          }
          if (Object.prototype.hasOwnProperty.call(value, MetadateTypesEnum.Map)) {
            const map = value[MetadateTypesEnum.Map]
            const metamap = Cardano.MetadataMap.new()
            // eslint-disable-next-line
            for (let i = 0; i < map.length; i++) {
              const { k, v } = map[i]
              metamap.insert(getTransactionMetadatum(k), getTransactionMetadatum(v))
            }
            return Cardano.TransactionMetadatum.new_map(metamap)
          }
        }

        const metadata = constructMetadata(metadataInput)
        const generalMetatada = Cardano.GeneralTransactionMetadata.new()
        // eslint-disable-next-line
        for (const key in metadata) {
          const value = metadata[key]
          generalMetatada.insert(Cardano.BigNum.from_str(key), getTransactionMetadatum(value))
        }
        return Cardano.TransactionMetadata.new(generalMetatada)
      },

      // min required for change
      minRequiredForChange: (txBuilder, address, value) => {
        const { Cardano } = this

        const minimumAda = Cardano.min_ada_required(
          value,
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
        )

        const baseValue = (() => {
          if (value.coin().compare(minimumAda) < 0) {
            const newVal = Cardano.Value.new(minimumAda)
            const assets = value.multiasset()
            if (assets) {
              newVal.set_multiasset(assets)
            }
            return newVal
          }
          return value
        })()

        const minRequired = txBuilder
          .fee_for_output(
            Cardano.TransactionOutput.new(Cardano.Address.from_bech32(address), baseValue),
          )
          .checked_add(minimumAda)

        return minRequired
      },

      // put utxo input
      addUtxoInput: (txBuilder, remaining, input, excludeIfSmall) => {
        const { Cardano, Utils } = this

        const txAddr = Cardano.Address.from_bech32(input.address)
        const txInput = Cardano.TransactionInput.new(
          Cardano.TransactionHash.from_bytes(Buffer.from(input.transaction.hash, 'hex')),
          input.index,
        )
        const txAmount = Utils.cardanoValueFromRemoteFormat(input)

        const skipOverflow = () => {
          const currentInputSum = txBuilder
            .get_explicit_input()
            .checked_add(txBuilder.get_implicit_input())

          try {
            currentInputSum.checked_add(txAmount)
          } catch (e) {
            return AddInputResult.OVERFLOW
          }
          return AddInputResult.VALID
        }

        const skipInput = () => {
          if (remaining == null) return skipOverflow()

          const tokenSetInInput = new Set(input.tokens.map((token) => token.asset.assetId))
          const remainingAda = remaining.value.coin().to_str()
          const remainingTokens = Utils.parseTokenList(remaining.value.multiasset())
          const includedTargets = remainingTokens.filter((entry) =>
            tokenSetInInput.has(entry.asset.assetId),
          )

          if (new BigNumber(remainingAda).gt(0) && new BigNumber(input.value).gt(0)) {
            includedTargets.push('lovelace')
          }

          if (includedTargets.length === 0 && remaining.hasInput) {
            return AddInputResult.NO_NEED
          }

          const onlyDefaultEntry =
            includedTargets.length === 1 && includedTargets.includes('lovelace')

          if (onlyDefaultEntry && excludeIfSmall) {
            const feeForInput = new BigNumber(
              txBuilder.fee_for_input(txAddr, txInput, txAmount).to_str(),
            )
            if (feeForInput.gt(input.value)) {
              return AddInputResult.TOO_SMALL
            }
          }

          return skipOverflow()
        }

        const skipResult = skipInput()
        if (skipResult !== AddInputResult.VALID) {
          return skipResult
        }

        txBuilder.add_input(txAddr, txInput, txAmount)

        return AddInputResult.VALID
      },
    }

    /**
     * Generate Policy ID and Script for pubkey
     * @param {string} publicKey change address
     * @return {object}
     */

    this.generatePolicyForPubkey = (publicKeyBech32) => {
      const { Cardano } = this

      const keyHash = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32).to_raw_key().hash()
      const scriptPubKey = Cardano.NativeScript.new_script_pubkey(Cardano.ScriptPubkey.new(keyHash))

      const scriptPubKeyHash = scriptPubKey.hash(Cardano.ScriptHashNamespace.NativeScript)
      const scriptHash = Cardano.ScriptHash.from_bytes(scriptPubKeyHash.to_bytes())

      const policyId = Buffer.from(scriptHash.to_bytes()).toString('hex')
      const script = Buffer.from(scriptPubKey.to_bytes()).toString('hex')

      return {
        script,
        policyId,
      }
    }

    /**
     * Mint and Send All Assets to Address
     * @param {string} toAddress receiver address
     * @param {array} utxos addresses utxos
     * @param {number} currentSlot network slot (needed for tx timeout calculation)
     * @param {object} metadata transaction metadata
     */

    this.txBuildMint = (
      toAddress,
      tokensToMint = [],
      utxos = [],
      currentSlot,
      metadata,
      donate,
    ) => {
      const { Cardano, Utils } = this

      try {
        if (this.validateAddress(toAddress) !== 'base') {
          throw ErrorException(ErrorMessages.ADDRESS_WRONG)
        }

        // create transaction
        const txBuilder = Cardano.TransactionBuilder.new(
          Cardano.LinearFee.new(
            Cardano.BigNum.from_str(protocolParams.linearFeeCoefficient),
            Cardano.BigNum.from_str(protocolParams.linearFeeConstant),
          ),
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
          Cardano.BigNum.from_str(protocolParams.poolDeposit),
          Cardano.BigNum.from_str(protocolParams.keyDeposit),
        )

        // set ttl
        const ttl = currentSlot + settings.ttl
        txBuilder.set_ttl(ttl)

        // set metadata
        if (metadata !== undefined) {
          const transformedMetadata = Utils.metadata(metadata)
          txBuilder.set_metadata(transformedMetadata)
        }

        // add inputs
        utxos.forEach((utxo) => {
          const added = Utils.addUtxoInput(txBuilder, undefined, utxo, false)
          if (added === AddInputResult.OVERFLOW) {
            throw ErrorException(ErrorMessages.ASSET_OVERFLOW)
          }
        })

        // set donate address
        let donateSubtract = '0'
        if (donate) {
          donateSubtract = donate.donateValue
          txBuilder.add_output(
            Cardano.TransactionOutput.new(
              Cardano.Address.from_bech32(donate.donateAddress),
              Cardano.Value.new(Cardano.BigNum.from_str(donate.donateValue)),
            ),
          )
        }

        // manually calculcate output values depends on output fee
        const mintValue = Utils.cardanoValueFromMint(protocolParams.minimumUtxoVal, tokensToMint)
        const minimumAda = Cardano.min_ada_required(
          mintValue,
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
        )
        const tokensValue = Utils.cardanoValueFromMint(minimumAda.to_str(), tokensToMint)

        const inputValue = txBuilder.get_explicit_input()
        const minValueSubtract = Cardano.Value.new(
          Cardano.BigNum.from_str(tokensValue.coin().to_str()),
        )
        const mergedValue = inputValue.checked_add(tokensValue).checked_sub(minValueSubtract)

        const outputTx = Cardano.TransactionOutput.new(
          Cardano.Address.from_bech32(toAddress),
          mergedValue,
        )
        const outputTxFee = txBuilder.fee_for_output(outputTx).to_str()
        const currentFee = txBuilder.min_fee().to_str()

        // TODO: as we can't set_mint() before txBuilder.build(), we can't calculate fee, that's why we should add compensation
        const COMPENSATE = '50000'

        const finalValue = mergedValue
          .checked_sub(Cardano.Value.new(Cardano.BigNum.from_str(outputTxFee)))
          .checked_sub(Cardano.Value.new(Cardano.BigNum.from_str(currentFee)))
          .checked_sub(Cardano.Value.new(Cardano.BigNum.from_str(COMPENSATE)))
          .checked_sub(Cardano.Value.new(Cardano.BigNum.from_str(donateSubtract)))

        // add output
        txBuilder.add_output(
          Cardano.TransactionOutput.new(Cardano.Address.from_bech32(toAddress), finalValue),
        )

        // add

        // set fee
        txBuilder.set_fee(
          Cardano.BigNum.from_str(
            (parseInt(txBuilder.min_fee().to_str(), 10) + parseInt(COMPENSATE, 10)).toString(),
          ),
        )

        // build
        const txBody = txBuilder.build()
        const mint = Utils.mint(tokensToMint)
        txBody.set_mint(mint)
        const outputs = txBody.outputs().len() > 0 ? Utils.parseOutputs(txBody) : []
        const txHash = Cardano.hash_transaction(txBody)

        // TODO: sign tx and calculate exact fee
        // {
        //   const fakeSignedTransaction = txSign(
        //     { txBody, txHash, usedUtxos: utxos, metadata },
        //     'xprv16z77fk24y90xgx24tz06sxa82kwme0rjezhe7kvtu8vtsm3lf3f34yzgf8qhvyx5txlxtg32jqm9jnv4a9qpy42nsa06uv4eu03zd4n4tqtnkp2nehy8anmf4gwtaa5e2vn4kwrw83xlrztzacv07cj45uum4023',
        //     script,
        //   )

        //   const fakeTxFee = Cardano.min_fee(
        //     Cardano.Transaction.from_bytes(Buffer.from(fakeSignedTransaction, 'hex')),
        //     Cardano.LinearFee.new(
        //       Cardano.BigNum.from_str(protocolParams.linearFeeCoefficient),
        //       Cardano.BigNum.from_str(protocolParams.linearFeeConstant),
        //     )
        //   )
        //   console.log('fakeTxFee', fakeTxFee.to_str())
        // }

        const targetOutput = txBuilder
          .get_explicit_output()
          .checked_add(Cardano.Value.new(txBuilder.get_deposit()))

        return {
          data: {
            txBodyHex: Buffer.from(txBody.to_bytes()).toString('hex'),
            txHashHex: Buffer.from(txHash.to_bytes()).toString('hex'),
            minFee: txBuilder.min_fee().to_str(),
            fee: txBuilder.get_fee_if_set().to_str(),
            spending: {
              value: (
                parseInt(targetOutput.coin().to_str(), 10) +
                parseInt(txBuilder.get_fee_if_set().to_str(), 10)
              ).toString(),
              send: targetOutput.coin().to_str(),
              tokens: Utils.parseTokenList(targetOutput.multiasset()),
            },
            outputs,
            usedUtxos: utxos,
            usedUtxosChange: [],
            metadata,
            ttl,
          },
        }
      } catch (error) {
        errorHandler(error)
        return {
          error,
        }
      }
    }

    /**
     * Send All Assets to Address
     * @param {string} toAddress receiver address
     * @param {array} utxos addresses utxos
     * @param {number} currentSlot network slot (needed for tx timeout calculation)
     * @param {object} metadata transaction metadata
     */

    this.txBuildAll = (toAddress, utxos = [], currentSlot, metadata) => {
      const { Cardano, Utils } = this

      try {
        if (this.validateAddress(toAddress) !== 'base') {
          throw ErrorException(ErrorMessages.ADDRESS_WRONG)
        }

        const totalBalance = utxos
          .map((utxo) => new BigNumber(utxo.value))
          .reduce((acc, value) => acc.plus(value), new BigNumber(0))

        if (totalBalance.isZero()) {
          throw ErrorException(ErrorMessages.NOT_ENOUGH)
        }

        if (new BigNumber(totalBalance).lt(new BigNumber(protocolParams.minimumUtxoVal))) {
          throw ErrorException(ErrorMessages.ADA_LESS_THAN_MIN)
        }

        // create transaction
        const txBuilder = Cardano.TransactionBuilder.new(
          Cardano.LinearFee.new(
            Cardano.BigNum.from_str(protocolParams.linearFeeCoefficient),
            Cardano.BigNum.from_str(protocolParams.linearFeeConstant),
          ),
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
          Cardano.BigNum.from_str(protocolParams.poolDeposit),
          Cardano.BigNum.from_str(protocolParams.keyDeposit),
        )

        // set ttl
        const ttl = currentSlot + settings.ttl
        txBuilder.set_ttl(ttl)

        // add inputs
        utxos.forEach((utxo) => {
          const added = Utils.addUtxoInput(txBuilder, undefined, utxo, false)

          if (added === AddInputResult.OVERFLOW) {
            throw ErrorException(ErrorMessages.ASSET_OVERFLOW)
          }
        })

        // set metadata
        if (metadata !== undefined) {
          const transformedMetadata = Utils.metadata(metadata)
          txBuilder.set_metadata(transformedMetadata)
        }

        if (totalBalance.lt(txBuilder.min_fee().to_str())) {
          // not enough in inputs to even cover the cost of including themselves in a tx
          throw ErrorException(ErrorMessages.NOT_ENOUGH)
        }

        // semantically, sending all ADA to somebody
        // is the same as if you're sending all the ADA as change to yourself
        // (module the fact the address doesn't belong to you)
        const changeAddress = Cardano.Address.from_bech32(toAddress)
        const couldSendAmount = txBuilder.add_change_if_needed(changeAddress)
        if (!couldSendAmount) {
          // if you couldn't send any amount,
          // it's because you couldn't cover the fee of adding an output
          throw ErrorException(ErrorMessages.NOT_ENOUGH)
        }

        // tx build
        const txBody = txBuilder.build()
        const txHash = Cardano.hash_transaction(txBody)
        const outputs = txBody.outputs().len() > 0 ? Utils.parseOutputs(txBody) : []

        const targetOutput = txBuilder
          .get_explicit_output()
          .checked_add(Cardano.Value.new(txBuilder.get_deposit()))

        return {
          data: {
            txBodyHex: Buffer.from(txBody.to_bytes()).toString('hex'),
            txHashHex: Buffer.from(txHash.to_bytes()).toString('hex'),
            minFee: txBuilder.min_fee().to_str(),
            fee: txBuilder.get_fee_if_set().to_str(),
            spending: {
              value: (
                parseInt(targetOutput.coin().to_str(), 10) +
                parseInt(txBuilder.get_fee_if_set().to_str(), 10)
              ).toString(),
              send: targetOutput.coin().to_str(),
              tokens: Utils.parseTokenList(targetOutput.multiasset()),
            },
            outputs,
            usedUtxos: utxos,
            usedUtxosChange: [],
            metadata,
            ttl,
          },
        }
      } catch (error) {
        errorHandler(error)
        return {
          error,
        }
      }
    }

    /**
     * Build Transaction
     * @param {array} outputs outputs array
     * @param {array} utxos addresses utxos
     * @param {string} changeAddress change address
     * @param {number} currentSlot network slot (needed for tx timeout calculation)
     * @param {object} metadata transaction metadata
     * @param {array} certificates delegation certificates
     * @param {array} withdrawals rewards withdrawal
     * @param {boolean} allowNoOutputs
     * @return {object}
     */

    this.txBuild = (
      outputs = [],
      utxos = [],
      changeAddress,
      currentSlot,
      metadata,
      certificates = [],
      withdrawals = [],
      allowNoOutputs = false,
    ) => {
      const { Cardano, Utils } = this

      try {
        // initial checks for errors
        outputs.forEach((output) => {
          if (this.validateAddress(output.address) !== 'base') {
            throw ErrorException(ErrorMessages.ADDRESS_WRONG)
          }

          if (new BigNumber(output.value).isNaN()) {
            throw ErrorException(ErrorMessages.ADA_NOT_NUMBER)
          }

          if (new BigNumber(output.value).lt(new BigNumber(protocolParams.minimumUtxoVal))) {
            throw ErrorException(ErrorMessages.ADA_LESS_THAN_MIN)
          }

          if (new BigNumber(output.value).decimalPlaces() > 6) {
            throw ErrorException(ErrorMessages.ADA_WRONG_VALUE)
          }

          if (output.tokens) {
            output.tokens.forEach((token) => {
              if (new BigNumber(token.quantity).lt(new BigNumber(1))) {
                throw ErrorException(ErrorMessages.TOKENS_NOT_ENOUGH)
              }
            })
          }
        })

        // allowNoOutputs in tx
        const shouldForceChange = (assetsForChange) => {
          const noOutputDisallowed = !allowNoOutputs && outputs.length === 0
          if (noOutputDisallowed && changeAddress == null) {
            throw ErrorException(ErrorMessages.NO_OUTPUTS)
          }
          if (assetsForChange != null && assetsForChange.len() > 0) {
            return true
          }
          return noOutputDisallowed
        }
        const emptyAsset = Cardano.MultiAsset.new()
        shouldForceChange(undefined)

        // create transaction
        const txBuilder = Cardano.TransactionBuilder.new(
          Cardano.LinearFee.new(
            Cardano.BigNum.from_str(protocolParams.linearFeeCoefficient),
            Cardano.BigNum.from_str(protocolParams.linearFeeConstant),
          ),
          Cardano.BigNum.from_str(protocolParams.minimumUtxoVal),
          Cardano.BigNum.from_str(protocolParams.poolDeposit),
          Cardano.BigNum.from_str(protocolParams.keyDeposit),
        )

        // set ttl
        const ttl = currentSlot + settings.ttl
        txBuilder.set_ttl(ttl)

        // add certificates
        if (certificates.length > 0) {
          const certsArray = certificates.reduce((certs, cert) => {
            certs.add(cert)
            return certs
          }, Cardano.Certificates.new())
          txBuilder.set_certs(certsArray)
        }

        // add withdrawal
        if (withdrawals.length > 0) {
          const processed = withdrawals.map((withdrawal) => {
            const address = Cardano.Address.from_bech32(withdrawal.address)
            return {
              address: Cardano.RewardAddress.from_address(address),
              amount: Cardano.BigNum.from_str(withdrawal.amount),
            }
          })

          const withdrawalArray = processed.reduce((withs, withdrawal) => {
            withs.insert(withdrawal.address, withdrawal.amount)
            return withs
          }, Cardano.Withdrawals.new())
          txBuilder.set_withdrawals(withdrawalArray)
        }

        // add metadata
        if (metadata !== undefined) {
          const transformedMetadata = Utils.metadata(metadata)
          txBuilder.set_metadata(transformedMetadata)
        }

        // add outputs
        outputs.forEach((output) => {
          txBuilder.add_output(
            Cardano.TransactionOutput.new(
              Cardano.Address.from_bech32(output.address),
              Utils.cardanoValueFromTokens(output.value, output.tokens),
            ),
          )
        })

        // add inputs
        // output excluding fee
        const targetOutput = txBuilder
          .get_explicit_output()
          .checked_add(Cardano.Value.new(txBuilder.get_deposit()))

        // used utxos for build transaction
        const usedUtxos = []
        {
          // recall: we might have some implicit input to start with from deposit refunds
          const implicitSum = txBuilder.get_implicit_input()

          // add utxos until we have enough to send the transaction
          utxos.forEach((utxo) => {
            const currentInputSum = txBuilder.get_explicit_input().checked_add(implicitSum)
            const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))
            const remainingNeeded = output.clamped_sub(currentInputSum)

            // update amount required to make sure we have ADA required for change UTXO entry
            if (
              shouldForceChange(
                currentInputSum.multiasset()?.sub(output.multiasset() ?? emptyAsset),
              )
            ) {
              if (changeAddress == null) throw ErrorException(ErrorMessages.NO_OUTPUTS)
              const difference = currentInputSum.clamped_sub(output)

              const minimumNeededForChange = Utils.minRequiredForChange(
                txBuilder,
                changeAddress,
                difference,
              )

              const adaNeededLeftForChange = minimumNeededForChange.clamped_sub(difference.coin())

              if (remainingNeeded.coin().compare(adaNeededLeftForChange) < 0) {
                remainingNeeded.set_coin(adaNeededLeftForChange)
              }
            }

            // stop if we've added all the assets we needed
            {
              const remainingAssets = remainingNeeded.multiasset()

              if (
                remainingNeeded.coin().compare(Cardano.BigNum.from_str('0')) === 0 &&
                (remainingAssets == null || remainingAssets.len() === 0) &&
                usedUtxos.length > 0
              ) {
                return
              }
            }

            // push utxo if needed
            const added = Utils.addUtxoInput(
              txBuilder,
              {
                value: remainingNeeded,
                hasInput: usedUtxos.length > 0,
              },
              utxo,
              true,
            )

            if (added !== AddInputResult.VALID) {
              return
            }

            usedUtxos.push(utxo)
          })

          if (usedUtxos.length === 0) {
            throw ErrorException(ErrorMessages.NOT_ENOUGH)
          }

          {
            // check to see if we have enough balance in the wallet to cover the transaction
            const currentInputSum = txBuilder.get_explicit_input().checked_add(implicitSum)
            const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))
            const compare = currentInputSum.compare(output)
            const enoughInput = compare != null && compare >= 0
            const forceChange = shouldForceChange(
              currentInputSum.multiasset()?.sub(output.multiasset() ?? emptyAsset),
            )

            if (forceChange) {
              if (changeAddress == null) throw ErrorException(ErrorMessages.NO_OUTPUTS)
              if (!enoughInput) {
                throw ErrorException(ErrorMessages.NOT_ENOUGH)
              }
              const difference = currentInputSum.checked_sub(output)
              const minimumNeededForChange = Utils.minRequiredForChange(
                txBuilder,
                changeAddress,
                difference,
              )
              if (difference.coin().compare(minimumNeededForChange) < 0) {
                throw ErrorException(ErrorMessages.NOT_ENOUGH)
              }
            }
            if (!forceChange && !enoughInput) {
              throw ErrorException(ErrorMessages.NOT_ENOUGH)
            }
          }
        }

        // handle fees & change address if set
        const usedUtxosChange = (() => {
          const totalInput = txBuilder
            .get_explicit_input()
            .checked_add(txBuilder.get_implicit_input())

          const difference = totalInput.checked_sub(targetOutput)

          const forceChange = shouldForceChange(difference.multiasset() ?? emptyAsset)
          if (changeAddress == null) {
            if (forceChange) {
              throw ErrorException(ErrorMessages.NO_OUTPUTS)
            }
            const minFee = txBuilder.min_fee()
            if (difference.coin().compare(minFee) < 0) {
              throw ErrorException(ErrorMessages.NOT_ENOUGH)
            }
            // recall: min fee assumes the largest fee possible
            // so no worries of cbor issue by including larger fee
            txBuilder.set_fee(Cardano.BigNum.from_str(difference.coin().to_str()))
            return []
          }
          const outputBeforeChange = txBuilder.get_explicit_output()

          const calcChangeAddress = Cardano.Address.from_bech32(changeAddress)
          const changeWasAdded = txBuilder.add_change_if_needed(calcChangeAddress)

          if (forceChange && !changeWasAdded) {
            // note: this should never happened since it should have been handled by earlier code
            throw ErrorException(ErrorMessages.NO_CHANGE)
          }

          const changeAda = txBuilder
            .get_explicit_output()
            .checked_sub(outputBeforeChange)
            .coin()
            .to_str()
          const changeTokens = Utils.parseTokenList(
            txBuilder.get_explicit_output().checked_sub(outputBeforeChange).multiasset(),
          )

          return changeWasAdded
            ? [
                {
                  address: changeAddress,
                  value: changeAda,
                  tokens: changeTokens,
                },
              ]
            : []
        })()

        // tx build
        const txBody = txBuilder.build()
        const txHash = Cardano.hash_transaction(txBody)

        return {
          data: {
            txBodyHex: Buffer.from(txBody.to_bytes()).toString('hex'),
            txHashHex: Buffer.from(txHash.to_bytes()).toString('hex'),
            minFee: txBuilder.min_fee().to_str(),
            fee: txBuilder.get_fee_if_set().to_str(),
            spending: {
              value: (
                parseInt(targetOutput.coin().to_str(), 10) +
                parseInt(txBuilder.get_fee_if_set().to_str(), 10)
              ).toString(),
              send: targetOutput.coin().to_str(),
              tokens: Utils.parseTokenList(targetOutput.multiasset()),
            },
            outputs,
            usedUtxos,
            usedUtxosChange,
            metadata,
            certificates,
            withdrawals,
            ttl,
          },
        }
      } catch (error) {
        errorHandler(error)
        return {
          error,
        }
      }
    }

    /**
     * Sign Transaction
     * @param {boolean} transaction build final transaction (not for calculation fees)
     * @param {string} privateKey to address
     * @return {object}
     */

    this.txSign = (transaction, privateKey, script) => {
      const { Cardano, Utils } = this

      try {
        const { txHashHex, txBodyHex, usedUtxos, metadata, certificates, withdrawals } = transaction

        const txHash = Cardano.TransactionHash.from_bytes(Buffer.from(txHashHex, 'hex'))
        const txBody = Cardano.TransactionBody.from_bytes(Buffer.from(txBodyHex, 'hex'))

        const witnesses = Cardano.TransactionWitnessSet.new()
        const vkeyWitnesses = Cardano.Vkeywitnesses.new()
        const deduped = []
        const keyHashes = []
        usedUtxos.forEach((senderUtxo) => {
          const keyAddress = Cardano.Address.from_bech32(senderUtxo.address)
          const keyHash = Cardano.BaseAddress.from_address(keyAddress).payment_cred().to_keyhash()
          const keyHex = Buffer.from(keyHash.to_bytes()).toString('hex')
          if (!keyHashes.includes(keyHex)) {
            keyHashes.push(keyHex)
            deduped.push(senderUtxo)
          }
        })

        deduped.forEach((utxo) => {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(utxo.addressing.type)
            .derive(utxo.addressing.path)
            .to_raw_key()
          const vkeyWitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(vkeyWitness)
        })

        if ((certificates && certificates.length > 0) || (withdrawals && withdrawals.length > 0)) {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(2)
            .derive(0)
            .to_raw_key()
          const stakeKeyVitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(stakeKeyVitness)
        }

        if (script) {
          const prvKey2 = Cardano.Bip32PrivateKey.from_bech32(privateKey).to_raw_key()
          const stakeKeyVitness = Cardano.make_vkey_witness(txHash, prvKey2)
          vkeyWitnesses.add(stakeKeyVitness)
        }

        if (script) {
          const nativeScripts = Cardano.NativeScripts.new()
          nativeScripts.add(Cardano.NativeScript.from_bytes(Buffer.from(script, 'hex')))
          witnesses.set_scripts(nativeScripts)
        }

        witnesses.set_vkeys(vkeyWitnesses)

        const transformedMetadata = metadata ? Utils.metadata(metadata) : undefined

        const signedTxRaw = Cardano.Transaction.new(txBody, witnesses, transformedMetadata)
        const signedTx = Buffer.from(signedTxRaw.to_bytes()).toString('hex')

        return signedTx
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Generate Delegation Certificates
     * @param {string} publicKeyBech32 publick key
     * @param {boolean} hasStakingKey is staking key exist
     * @param {string} poolId pool id
     * @return {array} certificates array
     */

    this.generateDelegationCerts = (publicKeyBech32, hasStakingKey, poolId) => {
      const { Cardano } = this

      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)
        const stakeKey = publicKey
          .derive(2) // chimeric
          .derive(0)

        const certificates = []

        if (!hasStakingKey) {
          const registrationCertificate = Cardano.Certificate.new_stake_registration(
            Cardano.StakeRegistration.new(
              Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            ),
          )
          certificates.push(registrationCertificate)
        }

        const delegationCertificate = Cardano.Certificate.new_stake_delegation(
          Cardano.StakeDelegation.new(
            Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
            Cardano.Ed25519KeyHash.from_bech32(poolId),
          ),
        )
        certificates.push(delegationCertificate)

        return certificates
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    /**
     * Generate Deregistration Certificates
     * @param {string} publicKeyBech32 publick key
     * @return {array} certificates array
     */

    this.generateDeregistrationCerts = (publicKeyBech32) => {
      const { Cardano } = this

      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)
        const stakeKey = publicKey
          .derive(2) // chimeric
          .derive(0)

        const certificates = []

        const deregistrationCertificate = Cardano.Certificate.new_stake_deregistration(
          Cardano.StakeDeregistration.new(
            Cardano.StakeCredential.from_keyhash(stakeKey.to_raw_key().hash()),
          ),
        )
        certificates.push(deregistrationCertificate)

        return certificates
      } catch (error) {
        errorHandler(error)
        return false
      }
    }

    return this
  })()
}

export default Crypto
