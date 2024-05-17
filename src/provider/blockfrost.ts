import { TTL } from "../config"
import * as T from "../types"

export class BlockfrostProvider implements T.Provider {
  private client: T.KoiosClient

  constructor(baseUrl: string, headers?: T.Headers) {
    throw new Error("Not implemented: BlockfrostProvider")
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    throw new Error("Not implemented: BlockfrostProvider.getProtocolParameters")
  }

  getUtxosByPaymentCred = async (paymentCred: string): Promise<T.Utxo[]> => {
    throw new Error("Not implemented: BlockfrostProvider.getUtxosByPaymentCred")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    throw new Error("Not implemented: BlockfrostProvider.getDelegation")
  }

  getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    throw new Error("Not implemented: BlockfrostProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<T.Script | undefined> => {
    throw new Error("Error: BlockfrostProvider.getDatumByhash")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    throw new Error("Not implemented: BlockfrostProvider.observeTx")
  }

  submitTx = async (tx: string): Promise<string> => {
    throw new Error("Not implemented: BlockfrostProvider.submitTx")
  }
}
