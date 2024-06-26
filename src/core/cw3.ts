import { TxBuilder } from "./txBuilder"
import { TxFinalizer } from "./txFinalizer"
import { Utils } from "../utils"
import { Account } from "./account"
import { Connector } from "./connector"
import {
  DEFAULT_ACCOUNT_DERIVATION_PATH,
  DEFAULT_ADDRESS_DERIVATION_PATH,
  DEFAULT_PROTOCOL_PARAMETERS,
  SLOT_CONFIG_NETWORK,
  TTL,
} from "../config"
import { KoiosProvider } from "../provider/koios"
import KoiosExplorer from "../explorer/koios"
import NftcdnExplorer from "../explorer/nftcdn"
import PricingExplorer from "../explorer/pricing"
import { Data, Constr } from "../utils/data"
import { Message } from "../utils/message"
import * as T from "../types"
import * as L from "../types/links"

/**
 * CardanoWeb3 class
 *
 * Main class for CardanoWeb3 library which provides all the necessary functions to interact with Cardano blockchain
 */
export class CardanoWeb3 {
  /** dcSpark @ Cardano Multiplatform Library */
  CML: typeof L.CML
  /** Emurgo @ Message Signing Library */
  MSL: typeof L.MSL
  /** UPLC @ Untyped Plutus Core Library */
  UPLC: typeof L.UPLC
  // /** Lucid Plutus Data Serialization Lib */
  Data: ReturnType<typeof Data>
  /** Lucid Plutus Data Construction Lib */
  Constr: typeof Constr
  /** Message Signing/Verification Lib */
  Message: ReturnType<typeof Message>
  explorer: T.Explorer
  provider: T.Provider
  utils: Utils
  __config: {
    network: T.NetworkConfig
    protocolParams: T.ProtocolParameters
    slotConfig: T.SlotConfig
    ttl: number
  }

  /**
   * Initialize CardanoWeb3 library
   * @param config Configuration object
   * @returns CardanoWeb3 instance
   */
  static init = async (config?: T.InitConfig) => {
    const cw3 = new CardanoWeb3()
    const network = config?.network || "mainnet"

    cw3.CML = await import("@dcspark/cardano-multiplatform-lib-nodejs")
    cw3.MSL = await import("@emurgo/cardano-message-signing-nodejs")
    cw3.UPLC = await import("uplc-node")
    cw3.Data = Data(cw3)
    cw3.Constr = Constr
    cw3.Message = Message(cw3)
    cw3.explorer = {
      koios: KoiosExplorer(
        config?.explorer?.koios?.url || `https://graph.xray.app/output/koios/${network}/api/v1`,
        config?.explorer?.koios?.headers
      ),
      nftcdn: NftcdnExplorer(
        config?.explorer?.nftcdn?.url || `https://graph.xray.app/output/nftcdn/${network}/api/v1`,
        config?.explorer?.nftcdn?.headers
      ),
      pricing: PricingExplorer(
        config?.explorer?.pricing?.url || `https://graph.xray.app/output/pricing/mainnet/api/v1`,
        config?.explorer?.pricing?.headers
      ),
    }
    cw3.provider = config?.provider || new KoiosProvider(`https://graph.xray.app/output/koios/${network}/api/v1`)
    cw3.utils = new Utils(cw3)
    cw3.__config = {
      network: {
        name: network,
        type: network === "mainnet" ? "mainnet" : "testnet",
        id: network === "mainnet" ? 1 : 0,
      },
      protocolParams: config?.protocolParams || DEFAULT_PROTOCOL_PARAMETERS,
      slotConfig: config?.slotConfig || SLOT_CONFIG_NETWORK[network],
      ttl: config?.ttl || TTL,
    }

    return cw3
  }

  connector = {
    /**
     * List available wallet connectors
     * @returns List of available connectors in window object
     */
    list: async () => {
      return await Connector.list()
    },

    /**
     * Check if wallet connector is enabled
     * @param wallet Wallet name
     * @returns True if wallet is enabled, false otherwise
     */
    isEnabled: async (wallet: string) => {
      return await Connector.isEnabled(wallet)
    },

    /**
     * Initialize wallet connector
     * @param wallet Wallet name
     * @param extensions Wallet extensions
     * @returns Wallet connector instance
     */
    init: async (wallet: string, extensions?: any) => {
      return await Connector.init(wallet, extensions)
    },
  }

  account = {
    /**
     * Generate new account from mnemonic
     * @param mnemonic Mnemonic
     * @param accountPath Account derivation path
     * @param addressPath Address derivation path
     * @returns Account instance
     */
    fromMnemonic: (
      mnemonic: string,
      accountPath: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
      addressPath: T.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
    ) => {
      return Account.fromMnemonic(this, mnemonic, accountPath, addressPath)
    },

    /**
     * Generate new account from xprv key
     * @param xprvKey Extended private key
     * @param accountPath Account derivation path (optioanl, default: [1852, 1815, 0])
     * @param addressPath Address derivation path (optional, default: [0, 0])
     * @returns Account instance
     */
    fromXprvKey: (
      xprvKey: string,
      accountPath: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
      addressPath: T.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
    ) => {
      return Account.fromXprvKey(this, xprvKey, accountPath, addressPath)
    },

    /**
     * Generate new account from xpub key
     * @param xpubKey Extended public key
     * @param addressPath  Known Address derivation path (optional, default: [0, 0])
     * @returns Account instance
     */
    fromXpubKey: (xpubKey: string, addressPath: T.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH) => {
      return Account.fromXpubKey(this, xpubKey, addressPath)
    },

    /**
     * Generate new account from wallet connector
     * @param connector Connector instance
     * @returns Account instance
     */
    fromConnector: (connector: L.Connector) => {
      return Account.fromConnector(this, connector)
    },

    // fromLedgerHW: (path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
    //   return Account.fromLedgerHW(this, path)
    // },

    // fromTrezorHW: (path: T.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
    //   return Account.fromTrezorHW(this, path)
    // },

    /**
     * Import account from JSON config
     * @param config Account export config
     * @returns Account instance
     */
    importAccount: (config: T.AccountExportV1) => {
      return Account.importAccount(this, config)
    },
  }

  /**
   * Generate new transaction builder
   * @returns Transaction builder instance
   */
  createTx = () => {
    return new TxBuilder(this)
  }

  /**
   * Import transaction from CBOR string
   * @param tx Transaction JSON
   * @returns Transaction finalizer instance
   */
  importTx = (tx: string) => {
    return new TxFinalizer(this, tx)
  }

  /**
   * Submit transaction to blockchain
   * @param tx CBOR encoded transaction
   * @returns Transaction hash
   */
  submitTx = async (tx: string) => {
    return await this.provider.submitTx(tx)
  }

  /**
   * Observe transaction
   * @param txHash Transaction hash
   * @param checkInterval Check interval in ms
   * @param maxTime Maximum time to wait in ms
   * @returns Transaction status (boolean)
   */
  observeTx = async (txHash: string, checkInterval: number, maxTime: number) => {
    return await this.provider.observeTx(txHash, checkInterval, maxTime)
  }

  /**
   * Submit and observe transaction
   * @param tx CBOR encoded transaction
   * @returns Transaction status (boolean)
   */
  submitAndObserveTx = async (tx: string) => {
    return await this.provider.submitAndObserveTx(tx)
  }

  /**
   * Generate new Natice Script for token minting
   * @param json Native token config
   * @returns Native token instance
   */
  createNativeScript = (json: T.NativeConfig) => {
    return this.utils.script.nativeScriptFromJson(json)
  }

  /**
   * Sign message with account private key
   * @param account Account instance
   * @param message Message to sign
   * @param password Password for xprv key (optional)
   * @returns Signed message
   */
  signMessageWithAccount = async (account: L.Account, message: string, password?: string): Promise<T.SignedMessage> => {
    if (account.__config.type === "xprv") {
      if (account.__config.xprvKeyIsEncoded && !password)
        throw new Error("Password is required to sign with xprv encoded account")
      const xprvKey = account.__config.xprvKeyIsEncoded ? account.decodeXprvKey(password) : account.__config.xprvKey
      const verificationKey = this.utils.keys.xprvToVrfKey(
        xprvKey,
        account.__config.accountPath,
        account.__config.addressPath
      )
      return this.signMessageWithVrfKey(verificationKey, account.__config.paymentAddress, message)
    }
    if (account.__config.type === "xpub") {
      throw new Error("Can't sign TX with xpub account type")
    }
    if (account.__config.type === "connector") {
      const hexAddress = this.CML.Address.from_bech32(account.__config.paymentAddress).to_hex()
      const hexMessage = this.utils.misc.fromStringToHex(message)
      return await account.__config.connector.signData(hexAddress, hexMessage)
    }
    if (account.__config.type === "ledger") {
      throw new Error("Ledger account signing is not implemented yet")
    }
    if (account.__config.type === "trezor") {
      throw new Error("Trezor account signing is not implemented yet")
    }
  }

  /**
   * Sign message with payment key
   * @param verificationKey Payment key
   * @param address Payment address
   * @param message Message to sign
   * @returns Signed message
   */
  signMessageWithVrfKey = (verificationKey: string, address: string, message: string): T.SignedMessage => {
    const hexAddress = this.CML.Address.from_bech32(address).to_hex()
    const hexMessage = this.utils.misc.fromStringToHex(message)
    const { paymentCred } = this.utils.address.getCredentials(address)
    const hash = this.CML.PrivateKey.from_bech32(verificationKey).to_public().hash().to_hex()
    if (!paymentCred?.hash || paymentCred?.hash !== hash) throw new Error("Verification key does not match the address")
    return this.Message.signData(hexAddress, hexMessage, verificationKey)
  }

  /**
   * Verify signed message
   * @param address Payment address
   * @param message Message to verify
   * @param signedMessage Signed message
   * @returns True if message is verified, false otherwise
   */
  verifyMessage = (address: string, message: string, signedMessage: T.SignedMessage): boolean => {
    const hexAddress = this.CML.Address.from_bech32(address).to_hex()
    const hexMessage = this.utils.misc.fromStringToHex(message)
    const { paymentCred, stakingCred } = this.utils.address.getCredentials(address)
    const hash = paymentCred?.hash || stakingCred?.hash
    if (!hash) throw new Error("Invalid address")
    return this.Message.verifyData(hexAddress, hash, hexMessage, signedMessage)
  }

  /**
   * Get current tip
   * @returns Current tip object
   */
  tip = async () => {
    return await this.provider.getTip()
  }
}
