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
import { KoiosProvider } from "../providers/koios"
import KoiosExplorer from "../explorers/koios"
import OgmiosExplorer from "../explorers/ogmios"
import KupoExplorer from "../explorers/kupo"
import NftcdnExplorer from "../explorers/nftcdn"
import { Data, Constr } from "../utils/data"
import { Message } from "../utils/message"
import * as CW3Types from "../types"
import * as L from "../types/links"

/**
 * CardanoWeb3 class
 *
 * Main class for CardanoWeb3 library which provides all the necessary functions to interact with Cardano blockchain
 */
export class CardanoWeb3 {
  libs: {
    CML: typeof L.CML // dcSpark @ Cardano Multiplatform Library
    MSL: typeof L.MSL // Emurgo @ Message Signing Library
    UPLC: typeof L.UPLC // UPLC @ Untyped Plutus Core Library
    PlutusData: ReturnType<typeof Data> // Lucid Plutus Data Serialization Lib
    PlutusConstr: typeof Constr // Lucid Plutus Data Construction Lib */
    Message: ReturnType<typeof Message> // Message Signing/Verification Lib
  }
  explorers: CW3Types.Explorers
  provider: CW3Types.Provider
  utils: Utils
  __config: {
    network: CW3Types.NetworkConfig
    protocolParams: CW3Types.ProtocolParameters
    slotConfig: CW3Types.SlotConfig
    ttl: number
  }

  /**
   * Initialize CardanoWeb3 library
   * @param config Configuration object
   * @returns CardanoWeb3 instance
   */
  static init = async (config?: CW3Types.InitConfig) => {
    const cw3 = new CardanoWeb3()
    const network = config?.network || "mainnet"

    cw3.libs = {
      CML: await import("@dcspark/cardano-multiplatform-lib-nodejs"),
      MSL: await import("@emurgo/cardano-message-signing-nodejs"),
      UPLC: await import("uplc-node"),
      PlutusData: Data(cw3),
      PlutusConstr: Constr,
      Message: Message(cw3),
    }
    cw3.explorers = {
      koios: KoiosExplorer(
        config?.explorer?.koios?.url || `https://graph.xray.app/output/koios/${network}/api/v1`,
        config?.explorer?.koios?.headers
      ),
      ogmios: OgmiosExplorer(
        config?.explorer?.ogmios?.url || `https://graph.xray.app/output/ogmios/${network}/api/v1`,
        config?.explorer?.ogmios?.headers
      ),
      kupo: KupoExplorer(
        config?.explorer?.kupo?.url || `https://graph.xray.app/output/kupo/${network}/api/v1`,
        config?.explorer?.kupo?.headers
      ),
      nftcdn: NftcdnExplorer(
        config?.explorer?.nftcdn?.url || `https://graph.xray.app/output/nftcdn/${network}/api/v1`,
        config?.explorer?.nftcdn?.headers
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
     * Create new account from mnemonic
     * @param mnemonic Mnemonic
     * @param accountPath Account derivation path
     * @param addressPath Address derivation path
     * @returns Account instance
     */
    fromMnemonic: (
      mnemonic: string,
      password?: string,
      accountPath: CW3Types.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
      addressPath: CW3Types.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
    ) => {
      return Account.fromMnemonic(this, mnemonic, password, accountPath, addressPath)
    },

    /**
     * Create new account from xprv key
     * @param xprvKey Extended private key
     * @param accountPath Account derivation path (optioanl, default: [1852, 1815, 0])
     * @param addressPath Address derivation path (optional, default: [0, 0])
     * @returns Account instance
     */
    fromXprvKey: (
      xprvKey: string,
      password?: string,
      accountPath: CW3Types.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH,
      addressPath: CW3Types.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH
    ) => {
      return Account.fromXprvKey(this, xprvKey, password, accountPath, addressPath)
    },

    /**
     * Create new account from xpub key
     * @param xpubKey Extended public key
     * @param addressPath  Known Address derivation path (optional, default: [0, 0])
     * @returns Account instance
     */
    fromXpubKey: (xpubKey: string, addressPath: CW3Types.AddressDerivationPath = DEFAULT_ADDRESS_DERIVATION_PATH) => {
      return Account.fromXpubKey(this, xpubKey, addressPath)
    },

    /**
     * Create new account from wallet connector
     * @param connector Connector instance
     * @returns Account instance
     */
    fromConnector: (connector: L.Connector) => {
      return Account.fromConnector(this, connector)
    },

    /**
     * Create a new account from address
     * @param address Bech32 address
     * @returns Account instance
     */
    fromAddress: (address: string) => {
      return Account.fromAddress(this, address)
    },

    // fromLedgerHW: (path: CW3Types.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
    //   return Account.fromLedgerHW(this, path)
    // },

    // fromTrezorHW: (path: CW3Types.AccountDerivationPath = DEFAULT_ACCOUNT_DERIVATION_PATH) => {
    //   return Account.fromTrezorHW(this, path)
    // },

    /**
     * Import account from JSON config
     * @param config Account export config
     * @returns Account instance
     */
    importAccount: (config: CW3Types.AccountExportV1) => {
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
   * Get current tip
   * @returns Current tip object
   */
  tip = async () => {
    return await this.provider.getTip()
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

  message = {
    /**
     * Sign message with account private key
     * @param account Account instance
     * @param message Message to sign
     * @param password Password for xprv key (optional)
     * @returns Signed message
     */
    signWithAccount: async (
      account: L.Account,
      message: string,
      password?: string
    ): Promise<CW3Types.SignedMessage> => {
      if (account.__config.type === "xprv") {
        if (account.__config.xprvKeyIsEncoded && !password)
          throw new Error("Password is required to sign with xprv encoded account")
        const xprvKey = account.__config.xprvKeyIsEncoded
          ? account.getDecodedXprvKey(password)
          : account.__config.xprvKey
        const verificationKey = this.utils.keys.xprvToVrfKey(
          xprvKey,
          account.__config.accountPath,
          account.__config.addressPath
        )
        return this.message.signWithVrfKey(verificationKey, account.__config.paymentAddress, message)
      }
      if (account.__config.type === "xpub") {
        throw new Error("Can't sign TX with xpub account type")
      }
      if (account.__config.type === "connector") {
        const hexAddress = this.libs.CML.Address.from_bech32(account.__config.paymentAddress).to_hex()
        const hexMessage = this.utils.misc.fromStringToHex(message)
        return await account.__config.connector.signData(hexAddress, hexMessage)
      }
      if (account.__config.type === "ledger") {
        throw new Error("Ledger account signing is not implemented yet")
      }
      if (account.__config.type === "trezor") {
        throw new Error("Trezor account signing is not implemented yet")
      }
    },

    /**
     * Sign message with payment key
     * @param verificationKey Payment key
     * @param address Payment address
     * @param message Message to sign
     * @returns Signed message
     */
    signWithVrfKey: (verificationKey: string, address: string, message: string): CW3Types.SignedMessage => {
      const hexAddress = this.libs.CML.Address.from_bech32(address).to_hex()
      const hexMessage = this.utils.misc.fromStringToHex(message)
      const { paymentCred } = this.utils.address.getCredentials(address)
      const hash = this.libs.CML.PrivateKey.from_bech32(verificationKey).to_public().hash().to_hex()
      if (!paymentCred?.hash || paymentCred?.hash !== hash)
        throw new Error("Verification key does not match the address")
      return this.libs.Message.signData(hexAddress, hexMessage, verificationKey)
    },

    /**
     * Verify signed message
     * @param address Payment address
     * @param message Message to verify
     * @param signedMessage Signed message
     * @returns True if message is verified, false otherwise
     */
    verify: (address: string, message: string, signedMessage: CW3Types.SignedMessage): boolean => {
      const hexAddress = this.libs.CML.Address.from_bech32(address).to_hex()
      const hexMessage = this.utils.misc.fromStringToHex(message)
      const { paymentCred, stakingCred } = this.utils.address.getCredentials(address)
      const hash = paymentCred?.hash || stakingCred?.hash
      if (!hash) throw new Error("Invalid address")
      return this.libs.Message.verifyData(hexAddress, hash, hexMessage, signedMessage)
    },
  }
}
