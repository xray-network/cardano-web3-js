import AssetFingerprint from "@emurgo/cip14-js"
import { TTL } from "../config"
import * as T from "../types"

export class KupmiosProvider implements T.Provider {
  private __ogmiosUrl: string
  private __ogmiosHeaders: T.Headers
  private __kupoUrl: string
  private __kupoHeaders: T.Headers

  constructor({
    ogmiosUrl,
    ogmiosHeaders,
    kupoUrl,
    kupoHeaders,
  }: {
    ogmiosUrl: string
    ogmiosHeaders?: T.Headers
    kupoUrl: string
    kupoHeaders?: T.Headers
  }) {
    this.__ogmiosUrl = ogmiosUrl
    this.__ogmiosHeaders = ogmiosHeaders
    this.__kupoUrl = kupoUrl
    this.__kupoHeaders = kupoHeaders
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    const response = await fetch(`${this.__ogmiosUrl}`, {
      method: "POST",
      headers: this.__ogmiosHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "queryLedgerState/protocolParameters",
      }),
    })
    if (response.ok) {
      const data = await response.json()
      const pp = data.result
      const scriptExecutionPricesMemory = pp.scriptExecutionPrices.memory.split("/")
      const scriptExecutionPricesCpu = pp.scriptExecutionPrices.cpu.split("/")
      return {
        minFeeA: parseInt(pp.minFeeCoefficient),
        minFeeB: parseInt(pp.minFeeConstant.ada.lovelace),
        maxTxSize: parseInt(pp.maxTransactionSize.bytes),
        maxValSize: parseInt(pp.maxValueSize.bytes),
        keyDeposit: BigInt(pp.stakeCredentialDeposit.ada.lovelace),
        poolDeposit: BigInt(pp.stakePoolDeposit.ada.lovelace),
        priceMem: parseInt(scriptExecutionPricesMemory[0]) / parseInt(scriptExecutionPricesMemory[1]),
        priceStep: parseInt(scriptExecutionPricesCpu[0]) / parseInt(scriptExecutionPricesCpu[1]),
        maxTxExMem: BigInt(pp.maxExecutionUnitsPerTransaction.memory),
        maxTxExSteps: BigInt(pp.maxExecutionUnitsPerTransaction.cpu),
        coinsPerUtxoByte: BigInt(pp.minUtxoDepositCoefficient),
        collateralPercentage: parseInt(pp.collateralPercentage),
        maxCollateralInputs: parseInt(pp.maxCollateralInputs),
        costModels: {
          PlutusV1: pp.plutusCostModels["plutus:v1"],
          PlutusV2: pp.plutusCostModels["plutus:v2"],
        },
      }
    }
    throw new Error("Error: KupmiosProvider.getProtocolParameters")
  }

  getUtxosByPaymentCred = async (paymentCred: string): Promise<T.Utxo[]> => {
    const response = await fetch(`${this.__kupoUrl}/matches/${paymentCred}/*?unspent`, {
      headers: this.__kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return kupoUtxoToUtxo(data)
    }
    throw new Error("Error: KupmiosProvider.getUtxosByPaymentCred")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    const response = await fetch(`${this.__ogmiosUrl}`, {
      method: "POST",
      headers: this.__ogmiosHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "queryLedgerState/rewardAccountSummaries",
        params: {
          keys: [stakingAddress],
        },
      }),
    })
    if (response.ok) {
      const data = await response.json()
      const delegation = Object.values((data.result || {}) as KupoDelegation)?.[0]
      return {
        delegation: delegation?.delegate?.id,
        rewards: BigInt(delegation?.rewards?.ada?.lovelace || 0),
      }
    }
    throw new Error("Error: KupmiosProvider.getDelegation")
  }

  getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    const response = await fetch(`${this.__kupoUrl}/datums/${datumHash}`, {
      headers: this.__kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return data?.datum
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<T.Script | undefined> => {
    const response = await fetch(`${this.__kupoUrl}/scripts/${scriptHash}`, {
      headers: this.__kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return {
        language:
          data.language === "plutus:v1" ? "PlutusV1" : data.language === "plutus:v2" ? "PlutusV2" : data.language,
        script: data?.script,
      }
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async (interval?: ReturnType<typeof setInterval>) => {
      const response = await fetch(`${this.__kupoUrl}/matches/*@${txHash}?unspent`, {
        headers: this.__kupoHeaders,
      })
      if (response.ok) {
        const data = await response.json()
        return data.length > 0
      } else {
        return false
      }
    }
    return new Promise(async (res) => {
      const resolve = await checkTx()
      if (resolve) return res(true)
      const confirm = setInterval(async () => {
        const resolve = await checkTx(confirm)
        if (resolve) {
          clearInterval(confirm)
          return res(true)
        }
      }, checkInterval)
      setTimeout(() => {
        clearInterval(confirm)
        return res(false)
      }, maxTime)
    })
  }

  submitTx = async (tx: string): Promise<string> => {
    const response = await fetch(`${this.__ogmiosUrl}`, {
      method: "POST",
      headers: this.__ogmiosHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "submitTransaction",
        params: {
          transaction: {
            cbor: tx,
          },
        },
      }),
    })
    if (response.ok) {
      const data = await response.json()
      return data?.result?.transaction?.id
    }
    if (!response.ok) {
      const data = await response.json()
      throw new Error(JSON.stringify(data.error))
    }
    throw new Error("Error: KupmiosProvider.submitTx")
  }
}

type KupoDelegation = {
  [k: string]: {
    delegate: { id: string }
    rewards: { ada: { lovelace: string } }
    deposit: { ada: { lovelace: string } }
  }
}

type KupoAssets = {
  [k: string]: string
}

type KupoUtxo = {
  transaction_index: number
  transaction_id: string
  output_index: number
  address: string
  value: {
    coins: string
    assets: KupoAssets
  }
  datum_hash: string | null
  script_hash: string | null
  created_at: {
    slot_no: number
    header_hash: string
  }
  spent_at: {
    slot_no: number
    header_hash: string
  } | null
}

const kupoUtxoToUtxo = (utxos: KupoUtxo[]): T.Utxo[] => {
  return utxos.map((utxo): T.Utxo => {
    return {
      transaction: {
        id: utxo.transaction_id,
      },
      index: utxo.transaction_index,
      address: utxo.address,
      value: BigInt(utxo.value.coins),
      assets: kupoAssetsToAssets(utxo.value.assets || {}),
      datumHash: utxo.datum_hash || undefined,
      scriptHash: utxo.script_hash || undefined,
    }
  })
}

const kupoAssetsToAssets = (assets: KupoAssets): T.Asset[] => {
  return Object.entries(assets).map(([id, quantity]): T.Asset => {
    const [policy_id, asset_name] = id.split(".")
    return {
      policyId: policy_id,
      assetName: asset_name || "",
      fingerprint: AssetFingerprint.fromParts(
        Buffer.from(policy_id, "hex"),
        Buffer.from(asset_name || "" || "", "hex")
      ).fingerprint(),
      quantity: BigInt(quantity),
    }
  })
}
