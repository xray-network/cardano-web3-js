import { TTL } from "../../config"
import * as T from "../../types"
import * as K from "./types"

export class KupmiosProvider implements T.Provider {
  private ogmiosUrl: string
  private ogmiosHeaders: T.Headers
  private kupoUrl: string
  private kupoHeaders: T.Headers

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
    this.ogmiosUrl = ogmiosUrl
    this.ogmiosHeaders = ogmiosHeaders
    this.kupoUrl = kupoUrl
    this.kupoHeaders = kupoHeaders
  }

  getTip = async (): Promise<T.Tip> => {
    const response = await fetch(`${this.ogmiosUrl}/health`)
    if (response.ok) {
      const tip = (await response.json()) as K.Health
      return {
        hash: tip.lastKnownTip.id,
        epochNo: tip.currentEpoch,
        absSlot: tip.lastKnownTip.slot,
        epochSlot: tip.slotInEpoch,
        blockNo: tip.lastKnownTip.height,
        blockTime: Math.floor(new Date(tip.lastTipUpdate).getTime() / 1000),
      }
    }
    throw new Error("Error: KupmiosProvider.getTip")
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    const response = await fetch(`${this.ogmiosUrl}`, {
      method: "POST",
      headers: this.ogmiosHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "queryLedgerState/protocolParameters",
      }),
    })
    if (response.ok) {
      const data = await response.json()
      return ogmiosProtocolParametersToProtocolParameters(data.result)
    }
    throw new Error("Error: KupmiosProvider.getProtocolParameters")
  }

  getUtxosByAddresses = async (addresses: string[]): Promise<T.Utxo[]> => {
    try {
      const utxos: T.Utxo[] = []
      for (const address of addresses) {
        const response = await fetch(`${this.kupoUrl}/matches/${address}?unspent`, {
          headers: this.kupoHeaders,
        })
        if (response.ok) {
          const data = await response.json()
          utxos.push(...kupoUtxosToUtxos(data))
        }
      }
      return utxos
    } catch {
      throw new Error("Error: KupmiosProvider.getUtxosByAddresses")
    }
  }

  getUtxosByAddress = async (address: string): Promise<T.Utxo[]> => {
    return await this.getUtxosByAddresses([address])
  }

  getUtxoByOutputRef = async (txHash: string, index: number): Promise<T.Utxo> => {
    const response = await fetch(`${this.kupoUrl}/matches/${index}@${txHash}?unspent`, {
      headers: this.kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return kupoUtxoToUtxo(data[0])
    }
    throw new Error("Error: KupmiosProvider.getUtxoByTxRef")
  }

  resolveUtxoDatumAndScript = async (utxo: T.Utxo): Promise<T.Utxo> => {
    return {
      ...utxo,
      datum: utxo.datumHash ? await this.getDatumByHash(utxo.datumHash) : null,
      script: utxo.scriptHash ? await this.getScriptByHash(utxo.scriptHash) : null,
    }
  }

  resolveUtxosDatumAndScript = async (utxos: T.Utxo[]) => {
    return await Promise.all(
      utxos.map(async (utxo) => {
        return await this.resolveUtxoDatumAndScript(utxo)
      })
    )
  }

  getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    const response = await fetch(`${this.kupoUrl}/datums/${datumHash}`, {
      headers: this.kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return data?.datum
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<T.Script | undefined> => {
    const response = await fetch(`${this.kupoUrl}/scripts/${scriptHash}`, {
      headers: this.kupoHeaders,
    })
    if (response.ok) {
      const data = await response.json()
      return {
        language: kupoPlutusVersionToPlutusVersion(data?.language),
        script: data?.script,
      }
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    const response = await fetch(`${this.ogmiosUrl}`, {
      method: "POST",
      headers: this.ogmiosHeaders,
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
      const delegation = Object.values((data.result || {}) as K.Delegation)?.[0]
      return {
        delegation: delegation?.delegate?.id,
        rewards: BigInt(delegation?.rewards?.ada?.lovelace || 0),
      }
    }
    throw new Error("Error: KupmiosProvider.getDelegation")
  }

  evaluateTx = async (tx: string): Promise<T.RedeemerCost[]> => {
    const response = await fetch(`${this.ogmiosUrl}`, {
      method: "POST",
      headers: this.ogmiosHeaders,
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: { transaction: { cbor: tx } },
      }),
    })
    if (response.ok) {
      return ((await response.json())?.result as T.RedeemerCost[]) || []
    }
    throw new Error("Error: KupmiosProvider.evaluateTx")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await fetch(`${this.kupoUrl}/matches/*@${txHash}?unspent`, {
        headers: this.kupoHeaders,
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
        const resolve = await checkTx()
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
    const response = await fetch(`${this.ogmiosUrl}`, {
      method: "POST",
      headers: this.ogmiosHeaders,
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

  submitAndObserveTx = async (
    tx: string,
    checkInterval: number = 3000,
    maxTime: number = TTL * 1000
  ): Promise<boolean> => {
    const txHash = await this.submitTx(tx)
    return this.observeTx(txHash, checkInterval, maxTime)
  }
}

const kupoUtxoToUtxo = (utxo: K.Utxo): T.Utxo => {
  return {
    transaction: {
      id: utxo.transaction_id,
    },
    index: utxo.output_index,
    address: utxo.address,
    value: BigInt(utxo.value.coins),
    assets: kupoAssetsToAssets(utxo.value.assets || {}),
    datumHash: utxo.datum_hash || null,
    datumType: utxo.datum_hash ? (utxo.datum_type === "hash" ? "hash" : "inline") : null,
    scriptHash: utxo.script_hash || null,
    datum: null,
    script: null,
  }
}

const kupoUtxosToUtxos = (utxos: K.Utxo[]): T.Utxo[] => {
  return utxos.map((utxo) => kupoUtxoToUtxo(utxo))
}

const kupoAssetsToAssets = (assets: K.Assets): T.Asset[] => {
  return Object.entries(assets).map(([id, quantity]): T.Asset => {
    const [policy_id, asset_name] = id.split(".")
    return {
      policyId: policy_id,
      assetName: asset_name || "",
      quantity: BigInt(quantity),
    }
  })
}

const kupoPlutusVersionToPlutusVersion = (plutusVersion: string) => {
  switch (plutusVersion) {
    case "plutus:v1":
      return "PlutusV1"
    case "plutus:v2":
      return "PlutusV2"
    case "plutus:v3":
      return "PlutusV3"
    case "native":
      return "Native"
    default:
      throw new Error("Invalid Plutus version")
  }
}

const ogmiosProtocolParametersToProtocolParameters = (pp: any): T.ProtocolParameters => {
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
      PlutusV3: pp.plutusCostModels["plutus:v3"],
    },
  }
}
