const Bech32 = require('bech32').bech32
const BigNumber = require('bignumber.js')
const Bip39 = require('bip39-light')
const CardanoWasm = require('@emurgo/cardano-serialization-lib-browser/cardano_serialization_lib_bg')

const Crypto = function (pkg, _protocolParams, _network, _errorHandler) {
  return (async () => {
    /**
     * Cardano Serialization Lib
     */
    this.Cardano = await CardanoWasm

    /**
     * Lib proxies
     */

    this.Bech32 = Bech32
    this.Bip39 = Bip39
    this.BigNumber = BigNumber

    /**
     * Cardano Serialization Lib
     */
    this.Network =
      _network || 'mainnet' === 'mainnet'
        ? this.Cardano.NetworkInfo.mainnet().network_id()
        : this.Cardano.NetworkInfo.testnet().network_id()

    /**
     * Protocol Parameters
     */

    const protocolParams = _protocolParams || {
      linearFeeCoefficient: '44',
      linearFeeConstant: '155381',
      minimumUtxoVal: '1000000',
      poolDeposit: '500000000',
      keyDeposit: '2000000',
      ttlOffset: 7200,
    }

    /**
     * Error Handler
     */

    const errorHandler =
      _errorHandler ||
      ((error) => {
        throw new Error(error)
      })

    /**
     * Bech to hex string converter
     * @param {string} str bech32 string
     * @return {string} hex string
     */

    this.bechToHex = (str) => {
      try {
        const tmp = Bech32.decode(str, 1000)
        return {
          prefix: tmp.prefix,
          data: Buffer.from(Bech32.fromWords(tmp.words)).toString('hex'),
        }
      } catch (error) {
        errorHandler(error)
      }
    }

    /**
     * Generate mnemonic
     * @param {number} length string length (words count)
     * @return {string} seed phrase
     */

    this.generateMmenonic = (length = 24) => {
      try {
        return Bip39.generateMnemonic((32 * length) / 3)
      } catch (error) {
        errorHandler(error)
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
      }
    }

    /**
     * Get account info (private key, public key, reward address, account ID)
     * @param {string} mnemonic mnemonic seed phrase
     * @return {object}
     */

    this.getAccountKeys = (mnemonic) => {
      const Cardano = this.Cardano
      const Network = this.Network
      try {
        const harden = (num) => {
          return 0x80000000 + num
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
        const accountId = this.bechToHex(rewardAddressBech32)

        return {
          privateKey: privateKeyBech32,
          publicKey: publicKeyBech32,
          rewardAddress: rewardAddressBech32,
          accountId: accountId.data.slice(2),
        }
      } catch (error) {
        errorHandler(error)
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

    this.getAccountAddresses = (publicKeyBech32, type = 'external', page = 20, shift = 0) => {
      const Cardano = this.Cardano
      const Network = this.Network
      try {
        const publicKey = Cardano.Bip32PublicKey.from_bech32(publicKeyBech32)
        let accountAdresses = {}

        const generateAddresses = (addressType) => {
          const tmpAddresses = {}
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
            const baseAddrBech32 = baseAddr.to_address().to_bech32()
            tmpAddresses[baseAddrBech32] = {
              type: addressType,
              path: i,
            }
          }
          return tmpAddresses
        }

        switch (type) {
          case 'external':
            accountAdresses = {
              ...generateAddresses(0),
            }
            break
          case 'internal':
            accountAdresses = {
              ...generateAddresses(1),
            }
            break
          case 'all':
            accountAdresses = {
              ...generateAddresses(0),
              ...generateAddresses(1),
            }
            break
          default:
            break
        }

        return {
          addresses: Object.keys(accountAdresses),
          paths: accountAdresses,
        }
      } catch (error) {
        errorHandler(error)
      }
    }

    /**
     * Validate Shelley Address
     * @param {string} address bech32 shelley address
     * @return {boolean} is valid
     */

    this.validateAddress = (address) => {
      const Cardano = this.Cardano

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
        return false
      }
    }

    /**
     * Build Transaction
     * @param {boolean} isSend build final transaction (not for calculation fees)
     * @param {BigNumber} value ADA amount
     * @param {string} toAddress to address
     * @param {string} changeAddress change address
     * @param {number} currentSlot network slot (needed for tx timeout calculation)
     * @param {array} utxos addresses utxos
     * @param {object} metadata transaction metadata
     * @param {array} certificates delegation certificates
     * @param {array} withdrawals rewards withdrawal
     * @return {object}
     */

    this.txBuild = (
      isSend,
      value,
      toAddress,
      changeAddress,
      currentSlot,
      utxos,
      metadata,
      certificates,
      withdrawals,
    ) => {
      const Cardano = this.Cardano

      try {
        // initial checks
        if (isSend && this.validateAddress(toAddress) !== 'base') {
          throw CardanoError('address_wrong')
        }
        if (isSend && new BigNumber(value).isNaN()) {
          throw CardanoError('ada_not_number')
        }
        if (isSend && new BigNumber(value).lt(new BigNumber(protocolParams.minimumUtxoVal))) {
          throw CardanoError('ada_less_than_min')
        }
        if (isSend && new BigNumber(value).decimalPlaces() > 6) {
          throw CardanoError('ada_wrong_value')
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
        txBuilder.set_ttl(currentSlot + protocolParams.ttlOffset)

        // add outputs
        if (toAddress) {
          txBuilder.add_output(
            Cardano.TransactionOutput.new(
              Cardano.Address.from_bech32(toAddress),
              Cardano.Value.new(Cardano.BigNum.from_str(new BigNumber(value).toFixed())),
            ),
          )
        }

        const hasCertificates = certificates.length > 0
        const hasWithdrawal = withdrawals.length > 0

        // add certificates
        if (hasCertificates) {
          const certsArray = certificates.reduce((certs, cert) => {
            certs.add(cert)
            return certs
          }, Cardano.Certificates.new())
          txBuilder.set_certs(certsArray)
        }

        // add withdrawal
        if (hasWithdrawal) {
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

        // add inputs
        const usedUtxos = []
        const targetOutput = txBuilder
          .get_explicit_output()
          .checked_add(Cardano.Value.new(txBuilder.get_deposit()))
        const implicitSum = txBuilder.get_implicit_input()
        let stopIterations = false

        utxos.forEach((tx) => {
          if (stopIterations) {
            return
          }
          const currentInputValue = txBuilder.get_explicit_input().checked_add(implicitSum)
          const currentInputValueRaw = txBuilder.get_explicit_input()
          const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))
          const remainingNeeded = output.clamped_sub(currentInputValue)

          let checkSkip = remainingNeeded.coin().compare(Cardano.BigNum.from_str('0')) === 0
          if (hasWithdrawal) {
            const compare = currentInputValueRaw.compare(output)
            checkSkip = compare != null && compare >= 0
          }
          if (checkSkip) {
            stopIterations = true
            return
          }

          usedUtxos.push(tx)
          txBuilder.add_input(
            Cardano.Address.from_bech32(tx.address),
            Cardano.TransactionInput.new(
              Cardano.TransactionHash.from_bytes(Buffer.from(tx.transaction.hash, 'hex')),
              tx.index,
            ),
            Cardano.Value.new(Cardano.BigNum.from_str(tx.value.toString())),
          )
        })

        // check if inputs values enough
        const currentInputValue = txBuilder.get_explicit_input().checked_add(implicitSum)
        const output = targetOutput.checked_add(Cardano.Value.new(txBuilder.min_fee()))

        const compare = currentInputValue.compare(output)
        const isEnough = compare != null && compare >= 0

        if (!isEnough) {
          throw CardanoError('ada_not_enough')
        }

        // add change address
        txBuilder.add_change_if_needed(Cardano.Address.from_bech32(changeAddress))

        // tx build
        const txBody = txBuilder.build()
        const txHash = Cardano.hash_transaction(txBody)

        return {
          txBody,
          txHash,
          minFee: new BigNumber(txBuilder.min_fee().to_str()),
          fee: new BigNumber(txBuilder.get_fee_if_set().to_str()),
          toAddress,
          value: new BigNumber(value).toFixed(),
          metadata,
          usedUtxos,
          certificates,
          withdrawals,
        }
      } catch (error) {
        errorHandler(error)
      }
    }

    /**
     * Sign Transaction
     * @param {boolean} transaction build final transaction (not for calculation fees)
     * @param {string} privateKey to address
     * @return {object}
     */

    this.txSign = (transaction, privateKey) => {
      const Cardano = this.Cardano

      try {
        const { txHash, txBody, metadata, usedUtxos, certificates, withdrawals } = transaction
        const vkeyWitnesses = Cardano.Vkeywitnesses.new()

        usedUtxos.forEach((utxo) => {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(utxo.addressing.type)
            .derive(utxo.addressing.path)
            .to_raw_key()
          const vkeyWitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(vkeyWitness)
        })

        if (certificates.length > 0 || withdrawals.length > 0) {
          const prvKey = Cardano.Bip32PrivateKey.from_bech32(privateKey)
            .derive(2)
            .derive(0)
            .to_raw_key()
          const stakeKeyVitness = Cardano.make_vkey_witness(txHash, prvKey)
          vkeyWitnesses.add(stakeKeyVitness)
        }

        const witnesses = Cardano.TransactionWitnessSet.new()
        witnesses.set_vkeys(vkeyWitnesses)
        const signedTxRaw = Cardano.Transaction.new(txBody, witnesses, metadata)

        const signedTx = Buffer.from(signedTxRaw.to_bytes()).toString('hex')

        return signedTx
      } catch (error) {
        errorHandler(error)
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
      const Cardano = this.Cardano

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
        return false
      }
    }

    return this
  })()
}

module.exports = Crypto
