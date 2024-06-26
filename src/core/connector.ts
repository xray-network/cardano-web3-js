import * as T from "../types"
import * as L from "../types/links"

declare global {
  interface Window {
    cardano: any
  }
}

export class Connector {
  __api: any

  /**
   * List available wallets
   * @returns List of available wallets
   */
  static list = async (): Promise<string[]> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    return Object.keys(window?.cardano || {})
  }

  /**
   * Check if a wallet is enabled
   * @param wallet Wallet name
   * @returns True if wallet is enabled
   */
  static isEnabled = async (wallet: string): Promise<string[]> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    return (await window?.cardano?.[wallet]?.isEnabled()) || false
  }

  /**
   * Initialize a wallet connector
   * @param wallet Wallet name
   * @param extensions Wallet extensions
   * @returns Connector instance
   */
  static init = async (wallet: string, extensions?: any): Promise<L.Connector | undefined> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    const connector = new Connector()
    if (!window?.cardano?.[wallet]) throw new Error(`Wallet ${wallet} not found`)
    const api = await window?.cardano?.[wallet].enable(extensions ? { extensions } : undefined)
    connector.__api = api
    return connector
  }

  /**
   * Get wallet extensions
   * @returns Wallet extensions
   */
  getExtensions = async (): Promise<any[]> => {
    return await this.__api.getExtensions()
  }

  /**
   * Get wallet network ID
   * @returns Wallet network ID (0 or 1)
   */
  getNetworkId = async (): Promise<number> => {
    return await this.__api.getNetworkId()
  }

  /**
   * Get wallet UTXOs
   * @param amount Amount to filter UTXOs
   * @param paginate Pagination options
   * @returns List of UTXOs
   */
  getUtxos = async (amount?: string, paginate?: T.ConnectorPaginate): Promise<string[] | null> => {
    return await this.__api.getUtxos(amount, paginate)
  }

  /**
   * Get wallet collaterals
   * @returns List of collaterals
   */
  getCollateral = async (): Promise<string[] | null> => {
    return await this.__api.getCollateral()
  }

  /**
   * Get wallet balance
   * @returns Wallet balance
   */
  getBalance = async (): Promise<string> => {
    return await this.__api.getBalance()
  }

  /**
   * Get wallet used addresses
   * @param paginate Pagination options
   * @returns Array of used addresses
   */
  getUsedAddresses = async (paginate?: T.ConnectorPaginate): Promise<string[]> => {
    return await this.__api.getUsedAddresses(paginate)
  }

  /**
   * Get wallet unused addresses
   * @returns Array of unused addresses
   */
  getUnusedAddresses = async (): Promise<string[]> => {
    return await this.__api.getUnusedAddresses()
  }

  /**
   * Get wallet change address
   * @returns Change address
   */
  getChangeAddress = async (): Promise<string> => {
    return await this.__api.getChangeAddress()
  }

  /**
   * Get wallet staking addresses
   * @returns Staking addresses
   */
  getRewardAddresses = async (): Promise<string[]> => {
    return await this.__api.getRewardAddresses()
  }

  /**
   * Sign a transaction
   * @param tx Transaction to sign in CBOR format
   * @param partialSign Partial sign flag (boolean)
   * @returns Staking key
   */
  signTx = async (tx: string, partialSign: boolean = false): Promise<string> => {
    return await this.__api.signTx(tx, partialSign)
  }

  /**
   * Sign a message
   * @param addr Address to sign message
   * @param payload Message to sign
   * @returns Signed message
   */
  signData = async (addr: string, payload: string): Promise<T.SignedMessage> => {
    return await this.__api.signData(addr, payload)
  }

  /**
   * Submit a transaction
   * @param tx Transaction to submit in CBOR format
   * @returns Transaction hash
   */
  submitTx = async (tx: string): Promise<string> => {
    return await this.__api.submitTx(tx)
  }
}
