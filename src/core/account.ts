import * as CW3Types from "../types"
import * as L from "../types/links"

export class Account {
  private cw3: L.CardanoWeb3
  __config: CW3Types.AccountConfig = {
    configVersion: 1,
    type: undefined,
    checksumImage: undefined,
    checksumId: undefined,
    xpubKey: undefined,
    xprvKey: undefined,
    xprvKeyIsEncoded: undefined,
    accountPath: undefined,
    addressPath: undefined,
    paymentAddress: undefined,
    paymentCred: undefined,
    stakingAddress: undefined,
    stakingCred: undefined,
    connector: undefined,
  }

  /**
   * Create a new account from mnemonic
   * @param cw3 CardanoWeb3 instance
   * @param mnemonic 24-word mnemonic
   * @param accountPath Account derivation path (e.g. [1852, 1815, 0])
   * @param addressPath Address derivation path (e.g. [0, 0])
   * @returns Account instance
   */
  static fromMnemonic = (
    cw3: L.CardanoWeb3,
    mnemonic: string,
    accountPath: CW3Types.AccountDerivationPath,
    addressPath: CW3Types.AddressDerivationPath
  ) => {
    const xprvKey = cw3.utils.keys.mnemonicToXprvKey(mnemonic)
    return this.fromXprvKey(cw3, xprvKey, accountPath, addressPath)
  }

  /**
   * Create a new account from xprv key
   * @param cw3 CardanoWeb3 instance
   * @param xprvKey Extended private key
   * @param accountPath Account derivation path (e.g. [1852, 1815, 0])
   * @param addressPath Address derivation path (e.g. [0, 0])
   * @returns Account instance
   */
  static fromXprvKey = (
    cw3: L.CardanoWeb3,
    xprvKey: string,
    accountPath: CW3Types.AccountDerivationPath,
    addressPath: CW3Types.AddressDerivationPath
  ) => {
    const account = new Account()
    const xpubKey = cw3.utils.keys.xprvKeyToXpubKey(xprvKey, accountPath)
    const checksum = cw3.utils.account.checksum(xpubKey)
    const accountDetails = cw3.utils.account.getDetailsFromXpub(xpubKey, addressPath)

    account.cw3 = cw3
    account.__config.accountPath = accountPath
    account.__config.addressPath = addressPath
    account.__config.xpubKey = xpubKey
    account.__config.xprvKey = xprvKey
    account.__config.type = "xprv"
    account.__config.checksumImage = checksum.checksumImage
    account.__config.checksumId = checksum.checksumId
    account.__config = {
      ...account.__config,
      ...accountDetails,
    }

    return account
  }

  /**
   * Create a new account from xpub key (limited functionality)
   * @param cw3 CardanoWeb3 instance
   * @param xpubKey Extended public key
   * @param addressPath Address derivation path (e.g. [0, 0])
   * @returns Account instance
   */
  static fromXpubKey = (cw3: L.CardanoWeb3, xpubKey: string, addressPath: CW3Types.AddressDerivationPath) => {
    if (!cw3.utils.keys.xpubKeyValidate(xpubKey)) throw new Error("Invalid public key")
    const account = new Account()
    const checksum = cw3.utils.account.checksum(xpubKey)
    const accountDetails = cw3.utils.account.getDetailsFromXpub(xpubKey, addressPath)

    account.cw3 = cw3
    account.__config.accountPath = undefined
    account.__config.addressPath = addressPath
    account.__config.xpubKey = xpubKey
    account.__config.xprvKey = undefined
    account.__config.type = "xpub"
    account.__config.checksumImage = checksum.checksumImage
    account.__config.checksumId = checksum.checksumId
    account.__config = {
      ...account.__config,
      ...accountDetails,
    }

    return account
  }

  /**
   * Create a new account from connector
   * @param cw3 CardanoWeb3 instance
   * @param connector Connector instance
   * @returns Account instance
   */
  static fromConnector = async (cw3: L.CardanoWeb3, connector: L.Connector) => {
    const connectorNetwork = await connector.getNetworkId()
    if (connectorNetwork !== cw3.__config.network.id) throw new Error("Connector network mismatch")

    const account = new Account()
    const mainAddress = (await connector.getUsedAddresses())?.[0] || (await connector.getUnusedAddresses())?.[0]
    const paymentAddress = cw3.libs.CML.Address.from_hex(mainAddress).to_bech32()
    const { paymentCred, stakingCred } = cw3.utils.address.getCredentials(paymentAddress)
    const stakingAddress = cw3.libs.CML.Address.from_hex((await connector.getRewardAddresses())[0]).to_bech32()

    account.cw3 = cw3
    account.__config.accountPath = undefined
    account.__config.addressPath = undefined
    account.__config.xpubKey = undefined
    account.__config.xprvKey = undefined
    account.__config.type = "connector"
    account.__config.checksumImage = undefined
    account.__config.checksumId = undefined
    account.__config.paymentAddress = paymentAddress
    account.__config.paymentCred = paymentCred.hash
    account.__config.stakingCred = stakingCred.hash
    account.__config.stakingAddress = stakingAddress
    account.__config.connector = connector

    return account
  }

  /**
   * Create a new account from address
   * @param cw3 CardanoWeb3 instance
   * @param address Bech32 address
   * @returns Account instance
   */
  static fromAddress = (cw3: L.CardanoWeb3, address: string) => {
    const account = new Account()
    const { paymentCred, stakingCred } = cw3.utils.address.getCredentials(address)
    const stakingAddress = cw3.utils.address.getStakingAddress(address)

    account.cw3 = cw3
    account.__config.accountPath = undefined
    account.__config.addressPath = undefined
    account.__config.xpubKey = undefined
    account.__config.xprvKey = undefined
    account.__config.type = "address"
    account.__config.checksumImage = undefined
    account.__config.checksumId = undefined
    account.__config.paymentAddress = address
    account.__config.paymentCred = paymentCred.hash
    account.__config.stakingCred = stakingCred.hash
    account.__config.stakingAddress = stakingAddress

    return account
  }

  // static fromLedgerHW = (cw3: CW3Types.CardanoWeb3, path: CW3Types.AccountDerivationPath) => {
  //   throw new Error("Not implemented: fromLedgerHW")
  //   if (typeof window === "undefined") throw new Error("fromLedgerHW is only available in the browser")
  //   const account = new Account()

  //   account.cw3 = cw3
  //   account.__config.type = "ledger"

  //   return account
  // }

  // static fromTrezorHW = (cw3: CW3Types.CardanoWeb3, path: CW3Types.AccountDerivationPath) => {
  //   throw new Error("Not implemented: fromLedgerHW")
  //   if (typeof window === "undefined") throw new Error("fromTrezorHW is only available in the browser")
  //   const account = new Account()

  //   account.cw3 = cw3
  //   account.__config.type = "trezor"

  //   return account
  // }

  /**
   * Import an account from configuration
   * @param cw3 CardanoWeb3 instance
   * @param config Account configuration
   * @returns Account instance
   */
  static importAccount = (cw3: L.CardanoWeb3, config: CW3Types.AccountExportV1) => {
    if (config.configVersion === 1) {
      if (config.type === "xprv") {
        const account = new Account()
        const xpubConfig = this.fromXpubKey(cw3, config.xpubKey, config.addressPath)

        account.cw3 = cw3
        account.__config = {
          ...xpubConfig.__config,
          type: config.type,
          xprvKey: config.xprvKey,
          xprvKeyIsEncoded: config.xprvKeyIsEncoded,
          accountPath: config.accountPath,
          addressPath: config.addressPath,
        }
        return account
      }
      if (config.type === "xpub") {
        return this.fromXpubKey(cw3, config.xpubKey, config.addressPath)
      }
      if (config.type === "address") {
        return this.fromAddress(cw3, config.paymentAddress)
      }
    }
    throw new Error(`Wrong account type for import. Only "xprv", "xpub", and "address" types are supported`)
  }

  /**
   * Export account configuration
   * @returns Account configuration
   */
  exportAccount = (): CW3Types.AccountExportV1 => {
    return {
      configVersion: this.__config.configVersion,
      type: this.__config.type,
      xpubKey: this.__config.xpubKey,
      xprvKey: this.__config.xprvKey,
      xprvKeyIsEncoded: this.__config.xprvKeyIsEncoded,
      accountPath: this.__config.accountPath,
      addressPath: this.__config.addressPath,
      paymentAddress: this.__config.paymentAddress,
      stakingAddress: this.__config.stakingAddress,
    }
  }

  /**
   * Encode key to encrypted state
   * @param password Password to encrypt the key
   * @throws Error if account type is wrong or xprv key is not found
   * @throws Error if account is already encrypted
   * @returns Encoded xprv key
   */
  getEncodedXprvKey = (password: string) => {
    if (!this.__config.xprvKey) throw new Error("Wrong account type. No xprv key found")
    if (this.__config.xprvKeyIsEncoded) throw new Error("Account is already encrypted, directly get xprv key")
    const xprvKey = this.cw3.utils.misc.encryptDataWithPass(this.__config.xprvKey, password)
    return xprvKey
  }

  /**
   * Decode key from encrypted state
   * @param password Password to decrypt the key
   * @returns Decoded xprv key
   * @throws Error if account is not encrypted or account type is wrong
   */
  getDecodedXprvKey = (password: string) => {
    if (!this.__config.xprvKey || !this.__config.xprvKeyIsEncoded)
      throw new Error("Account is not encrypted or account type is wrong")
    const xprvKey = this.cw3.utils.misc.decryptDataWithPass(this.__config.xprvKey, password)
    return xprvKey
  }

  /**
   * Get account state and update internal state
   * @returns Account state
   */

  getState = async (): Promise<CW3Types.AccountState> => {
    // TODO: Implement getUtxosFromConnector if account type is connector
    // const getUtxosFromConnector = async (): Promise<CW3Types.Utxo[]> => {
    //   const utxosRaw = await this.__config.connector.getUtxos()
    //   const utxos = utxosRaw.map((utxoRaw) => {
    //     const utxo = this.cw3.CML.TransactionUnspentOutput.from_cbor_hex(utxoRaw)
    //     const input = this.cw3.CML.SingleInputBuilder.from_transaction_unspent_output(utxo)
    //     console.log(utxo)
    //     console.log(input)
    //     return {
    //       transaction: {
    //         id: "",
    //       },
    //       index: 0,
    //       address: "",
    //       value: 0n,
    //       assets: [],
    //       datumHash: null,
    //       datumType: null,
    //       scriptHash: null,
    //       datum: null,
    //       script: null,
    //     }
    //   })
    //   return utxos
    // }
    // console.log(getUtxosFromConnector)
    // const utxos =
    //   this.__config.type !== "connector"
    //     ? await this.cw3.provider.getUtxosByAddress(this.__config.paymentAddress)
    //     : await getUtxosFromConnector()
    const utxos = await this.cw3.provider.getUtxosByAddress(this.__config.paymentAddress)
    const balance = this.cw3.utils.account.getBalanceFromUtxos(utxos)

    return {
      utxos,
      balance,
    }
  }

  getDelegation = async (): Promise<CW3Types.AccountDelegation> => {
    const delegation = await this.cw3.provider.getDelegation(this.__config.stakingAddress)

    return {
      delegation: delegation?.delegation || null,
      rewards: delegation?.rewards,
    }
  }
}
