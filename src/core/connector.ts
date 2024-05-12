import * as T from "../types"

declare global {
  interface Window {
    cardano: any
  }
}

export class Connector {
  private cw3: T.CardanoWeb3
  __api: any

  static list = async (): Promise<string[]> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    return Object.keys(window?.cardano || {})
  }

  static isEnabled = async (wallet: string): Promise<string[]> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    return (await window?.cardano?.[wallet]?.isEnabled()) || false
  }

  static init = async (cw3: T.CardanoWeb3, wallet: string, extensions?: any): Promise<T.Connector> => {
    if (typeof window === "undefined") throw new Error("Connector is only available in the browser environment")
    const connector = new Connector()
    connector.cw3 = cw3
    try {
      if (!window?.cardano?.[wallet]) throw new Error(`Wallet ${wallet} not found`)
      const api = await window?.cardano?.[wallet].enable(extensions ? { extensions } : undefined)
      connector.__api = api
      return connector
    } catch (e) {
      console.log(e)
    }
  }

  getExtensions = async (): Promise<any[]> => {
    return await this.__api.getExtensions()
  }

  getNetworkId = async (): Promise<number> => {
    return await this.__api.getNetworkId()
  }

  getUtxos = async (amount?: string, paginate?: T.ConnectorPaginate): Promise<string[] | null> => {
    const { C, utils } = this.cw3
    return (await this.__api.getUtxos()) as string[]
  }

  getCollateral = async (): Promise<string[] | null> => {
    const { C, utils } = this.cw3
    return (await this.__api.getCollateral()) as string[]
  }

  getBalance = async (): Promise<string> => {
    const { C, utils } = this.cw3
    return (await this.__api.getBalance()) as string
  }

  getUsedAddresses = async (paginate?: T.ConnectorPaginate): Promise<string[]> => {
    const { C, utils } = this.cw3
    const addresses = (await this.__api.getUsedAddresses(paginate)) as string[]
    return addresses.map((addr) => C.Address.from_hex(addr).to_bech32())
  }

  getUnusedAddresses = async (): Promise<string[]> => {
    const { C, utils } = this.cw3
    const addresses = (await this.__api.getUnusedAddresses()) as string[] as string[]
    return addresses.map((addr) => C.Address.from_hex(addr).to_bech32())
  }

  getChangeAddress = async (): Promise<string> => {
    const { C, utils } = this.cw3
    const address = (await this.__api.getChangeAddress()) as string
    return C.Address.from_hex(address).to_bech32()
  }

  getRewardAddresses = async (): Promise<string[]> => {
    const { C, utils } = this.cw3
    const addresses = (await this.__api.getRewardAddresses()) as string[] as string[]
    return addresses.map((addr) => C.Address.from_hex(addr).to_bech32())
  }

  signTx = async (tx: string, partialSign: boolean = false): Promise<string> => {
    return (await this.__api.signTx(tx, partialSign)) as string
  }

  signData = async (addr: string, payload: string): Promise<string> => {
    return (await this.__api.signData(addr, payload)) as string
  }

  submitTx = async (tx: string): Promise<string> => {
    return (await this.__api.submitTx(tx)) as string
  }
}
