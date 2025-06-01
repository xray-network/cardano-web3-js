import {
  DEFAULT_ACCOUNT_DERIVATION_PATH,
  DEFAULT_ADDRESS_DERIVATION_PATH,
  DEFAULT_PROTOCOL_PARAMETERS,
  SLOT_CONFIG_NETWORK,
  TTL,
} from "@/config"

import { CML, Message, utils, CW3Types } from "@"
import { TxBuilder } from "./txBuilder"
import { TxFinalizer } from "./txFinalizer"
import { Account } from "./account"
import { Connector } from "./connector"
import { KoiosProvider } from "@/providers/koios"
import { KoiosClient } from "@/explorers/koios"
import { OgmiosClient } from "@/explorers/ogmios"
import { KupoClient } from "@/explorers/kupo"
import { NftcdnClient } from "@/explorers/nftcdn"

/**
 * CardanoWeb3 class
 * Main class for CardanoWeb3 library which provides all the necessary functions to interact with Cardano blockchain
 */
export class CardanoWeb3 {
  provider: CW3Types.Provider
  explorers: CW3Types.Explorers
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
  constructor(config?: CW3Types.InitConfig) {
    const network = config?.network || "mainnet"
    this.provider = config?.provider || new KoiosProvider(`https://graph.xray.app/output/koios/${network}/api/v1`)
    this.explorers = {
      koios: KoiosClient(
        config?.explorer?.koios?.url || `https://graph.xray.app/output/koios/${network}/api/v1`,
        config?.explorer?.koios?.headers
      ),
      ogmios: OgmiosClient(
        config?.explorer?.ogmios?.url || `https://graph.xray.app/output/ogmios/${network}/api/v1`,
        config?.explorer?.ogmios?.headers
      ),
      kupo: KupoClient(
        config?.explorer?.kupo?.url || `https://graph.xray.app/output/kupo/${network}/api/v1`,
        config?.explorer?.kupo?.headers
      ),
      nftcdn: NftcdnClient(
        config?.explorer?.nftcdn?.url || `https://graph.xray.app/output/nftcdn/${network}/api/v1`,
        config?.explorer?.nftcdn?.headers
      ),
    }
    this.__config = {
      network: {
        name: network,
        type: network === "mainnet" ? "mainnet" : "testnet",
        id: network === "mainnet" ? 1 : 0,
      },
      protocolParams: config?.protocolParams || DEFAULT_PROTOCOL_PARAMETERS,
      slotConfig: config?.slotConfig || SLOT_CONFIG_NETWORK[network],
      ttl: config?.ttl || TTL,
    }
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
    fromConnector: (connector: Connector) => {
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
  getTip = async () => {
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
    signWithAccount: async (account: Account, message: string, password?: string): Promise<CW3Types.SignedMessage> => {
      if (account.__config.type === "xprv") {
        if (account.__config.xprvKeyIsEncoded && !password)
          throw new Error("Password is required to sign with xprv encoded account")
        const xprvKey = account.__config.xprvKeyIsEncoded
          ? account.getDecodedXprvKey(password)
          : account.__config.xprvKey
        const verificationKey = utils.keys.xprvToVrfKey(
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
        const hexAddress = CML.Address.from_bech32(account.__config.paymentAddress).to_hex()
        const hexMessage = utils.misc.fromStringToHex(message)
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
      const hexAddress = CML.Address.from_bech32(address).to_hex()
      const hexMessage = utils.misc.fromStringToHex(message)
      const { paymentCred } = utils.address.getCredentials(address)
      const hash = CML.PrivateKey.from_bech32(verificationKey).to_public().hash().to_hex()
      if (!paymentCred?.hash || paymentCred?.hash !== hash)
        throw new Error("Verification key does not match the address")
      return Message.signData(hexAddress, hexMessage, verificationKey)
    },

    /**
     * Verify signed message
     * @param address Payment address
     * @param message Message to verify
     * @param signedMessage Signed message
     * @returns True if message is verified, false otherwise
     */
    verify: (address: string, message: string, signedMessage: CW3Types.SignedMessage): boolean => {
      const hexAddress = CML.Address.from_bech32(address).to_hex()
      const hexMessage = utils.misc.fromStringToHex(message)
      const { paymentCred, stakingCred } = utils.address.getCredentials(address)
      const hash = paymentCred?.hash || stakingCred?.hash
      if (!hash) throw new Error("Invalid address")
      return Message.verifyData(hexAddress, hash, hexMessage, signedMessage)
    },
  }
}
