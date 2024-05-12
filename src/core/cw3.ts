import { CML, MSL } from "./loader"
import { Tx } from "./tx"
import KoiosExplorer from "../explorer/koios"
import NftcdnExplorer from "../explorer/nftcdn"
import PricingExplorer from "../explorer/pricing"
import { Utils } from "../utils"
import { Account } from "./account"
import { Connector } from "./connector"
import { DEFAULT_ACCOUNT_DERIVATION_PATH, TTL } from "../config"
import { KoiosProvider } from "../provider/koios"
import * as T from "../types"

export class CardanoWeb3 {
  C: T.C // dcSpark @ Cardano Multiplatform Library
  M: T.M // Emurgo @ Message Signing Library
  network: T.NetworkConfig
  ttl: number
  explorer: T.Explorer
  provider: T.Provider
  remoteProtocolParams: boolean
  remoteTxEvaluate: boolean
  utils: ReturnType<typeof Utils.init>

  static init = async (config?: T.InitConfig): Promise<CardanoWeb3> => {
    const cw3 = new CardanoWeb3()
    const network = config?.network || "mainnet"

    cw3.C = await CML()
    cw3.M = await MSL()
    cw3.network = getNetworkConfig(network)
    cw3.ttl = config?.ttl || TTL
    cw3.explorer = {
      koios: KoiosExplorer(
        config?.explorer?.koios?.url || `https://graph.xray.app/output/koios/${network}/api/v1`,
        config?.explorer?.koios?.headers
      ),
      nftcdn: NftcdnExplorer(
        config?.explorer?.nftcdn?.url || `https://graph.xray.app/output/nftcdn/${network}/api/v1`,
        config?.explorer?.nftcdn?.headers
      ),
      price: PricingExplorer(
        config?.explorer?.pricing?.url || `https://graph.xray.app/output/pricing/mainnet/api/v1`,
        config?.explorer?.pricing?.headers
      ),
    }
    cw3.provider = config?.provider || new KoiosProvider(`https://graph.xray.app/output/koios/${network}/api/v1`)
    cw3.remoteProtocolParams = config?.remoteProtocolParams || false
    cw3.remoteTxEvaluate = config?.remoteTxEvaluate || false
    cw3.utils = Utils.init(cw3)

    return cw3
  }

  connector = {
    list: async () => {
      return await Connector.list()
    },

    isEnabled: async (wallet: string) => {
      return await Connector.isEnabled(wallet)
    },

    init: async (wallet: string, extensions?: any) => {
      return await Connector.init(this, wallet, extensions)
    },
  }

  account = {
    fromMnemonic: (mnemonic: string, path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
      return Account.fromMnemonic(this, mnemonic, path)
    },

    fromXprvKey: (xprvKey: string, path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
      return Account.fromXprvKey(this, xprvKey, path)
    },

    fromXpubKey: (xpubKey: string) => {
      return Account.fromXpubKey(this, xpubKey)
    },

    fromXvkKey: (xvkKey: string) => {
      return Account.fromXvkKey(this, xvkKey)
    },

    fromConnector: (connector: T.Connector) => {
      return Account.fromConnector(this, connector)
    },

    fromLedgerHW: (path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
      return Account.fromLedgerHW(this, path)
    },

    fromTrezorHW: (path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
      return Account.fromTrezorHW(this, path)
    },
  }

  createTx = async () => {
    return await Tx.init(this)
  }

  createTxFromAccount = async (account: T.Account) => {
    return await Tx.init(this, account)
  }
}

const getNetworkConfig = (network: T.NetworkName): T.NetworkConfig => {
  return {
    name: network,
    type: network === "mainnet" ? "mainnet" : "testnet",
    id: network === "mainnet" ? 1 : 0,
  }
}
