import { TTL } from "../config"
import * as T from "../types"

export class KupmiosProvider implements T.Provider {
  private client: T.KoiosClient

  constructor(baseUrl: string, headers?: T.Headers) {
    throw new Error("Not implemented: KupmiosProvider")
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    throw new Error("Not implemented: KupmiosProvider.getProtocolParameters")
  }

  getUtxosByPaymentCred = async (paymentCred: string): Promise<T.Utxo[]> => {
    throw new Error("Not implemented: KupmiosProvider.getUtxosByPaymentCred")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    throw new Error("Not implemented: KupmiosProvider.getDelegation")
  }

  getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    throw new Error("Not implemented: KupmiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<string | undefined> => {
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    throw new Error("Not implemented: KupmiosProvider.observeTx")
  }

  submitTx = async (tx: string): Promise<string> => {
    throw new Error("Not implemented: KupmiosProvider.submitTx")
  }
}
