import * as T from "../types"

export class Account {
  private cw3: T.CardanoWeb3
  __state: T.AccountState = {
    utxos: [],
    balance: {
      lovelace: 0n,
      assets: [],
    },
    delegation: undefined,
    rewards: 0n,
  }
  __config: T.AccountConfig = {
    xpubKey: undefined,
    derivationPath: undefined,
    changeAddress: undefined,
    paymentCred: undefined,
    stakingCred: undefined,
    stakingAddress: undefined,
  }

  static fromXprvKey = (cw3: T.CardanoWeb3, xprvKey: string, path: T.AccountDerivationPath) => {
    const account = new Account()
    const { C, utils } = cw3

    const xpubKey = C.Bip32PrivateKey.from_bech32(xprvKey)
      .derive(utils.misc.harden(path[0]))
      .derive(utils.misc.harden(path[1]))
      .derive(utils.misc.harden(path[2]))
      .to_public()
      .to_bech32()
    const accountDetails = utils.account.getDetailsFromXpub(xpubKey)

    account.cw3 = cw3
    account.__config.derivationPath = path
    account.__config.xpubKey = xpubKey
    account.__config = {
      ...account.__config,
      ...accountDetails,
    }

    return account
  }

  static fromMnemonic = (cw3: T.CardanoWeb3, mnemonic: string, path: T.AccountDerivationPath) => {
    const xprvKey = cw3.utils.keys.xprvKeyFromMnemonic(mnemonic)
    return this.fromXprvKey(cw3, xprvKey, path)
  }

  static fromXpubKey = (cw3: T.CardanoWeb3, xpubKey: string) => {
    const account = new Account()
    const { C, utils } = cw3

    if (!utils.keys.xpubKeyValidate(xpubKey)) throw new Error("Invalid public key")
    const accountDetails = utils.account.getDetailsFromXpub(xpubKey)

    account.cw3 = cw3
    account.__config.derivationPath = undefined
    account.__config.xpubKey = xpubKey
    account.__config = {
      ...account.__config,
      ...accountDetails,
    }

    return account
  }

  static fromXvkKey = (cw3: T.CardanoWeb3, xvkKey: string) => {
    const xpubKey = cw3.utils.keys.xpubKeyFromXvkKey(xvkKey)
    return this.fromXpubKey(cw3, xpubKey)
  }

  static fromConnector = async (cw3: T.CardanoWeb3, connector: T.Connector) => {
    const account = new Account()

    account.cw3 = cw3
    account.__config.derivationPath = undefined
    account.__config.xpubKey = undefined

    const changeAddress = await connector.getChangeAddress()
    const paymentCreds = cw3.utils.address.getCredentials(changeAddress)
    const stakingAddress = (await connector.getRewardAddresses())[0]

    account.__config.changeAddress = await connector.getChangeAddress()
    account.__config.paymentCred = paymentCreds.paymentCred
    account.__config.stakingCred = paymentCreds.stakingCred
    account.__config.stakingAddress = stakingAddress

    return account
  }

  static fromLedgerHW = (cw3: T.CardanoWeb3, path: T.AccountDerivationPath) => {
    throw new Error("Not implemented: fromLedgerHW")
    // if (typeof window === "undefined") throw new Error("fromLedgerHW is only available in the browser")
    // const account = new Account()

    // account.__config.source = "ledger"
    // account.cw3 = cw3

    // return account
  }

  static fromTrezorHW = (cw3: T.CardanoWeb3, path: T.AccountDerivationPath) => {
    throw new Error("Not implemented: fromLedgerHW")
    // if (typeof window === "undefined") throw new Error("fromTrezorHW is only available in the browser")
    // const account = new Account()

    // account.__state.source = "trezor"
    // account.cw3 = cw3

    // return account
  }

  setChangeAddress = (address: string) => {
    this.__config.changeAddress = address
  }

  fetchAndUpdateState = async () => {
    const utxos = await this.cw3.provider.getUtxosByPaymentCred(this.__config.paymentCred)
    const delegation = await this.cw3.provider.getDelegation(this.__config.stakingAddress)
    const balance = this.cw3.utils.account.getBalanceFromUtxos(utxos)

    this.__state.utxos = utxos
    this.__state.balance = balance
    this.__state.delegation = delegation?.delegation
    this.__state.rewards = delegation?.rewards

    return {
      utxos,
      balance,
      delegation: delegation?.delegation,
      rewards: delegation?.rewards,
    }
  }
}
