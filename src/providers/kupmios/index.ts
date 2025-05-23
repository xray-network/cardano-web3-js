import { TTL } from "@/config"

import KupoClient, { KupoTypes } from "cardano-kupo-client"
import OgmiosClient, { OgmiosTypes } from "cardano-ogmios-client"
import { CW3Types } from "@"
import * as KupmiosProviderTypes from "./types"

export class KupmiosProvider implements CW3Types.Provider {
  private ogmiosClient: CW3Types.OgmiosClient
  private kupoClient: CW3Types.KupoClient

  constructor({
    ogmiosUrl,
    ogmiosHeaders,
    kupoUrl,
    kupoHeaders,
  }: {
    ogmiosUrl: string
    ogmiosHeaders?: CW3Types.Headers
    kupoUrl: string
    kupoHeaders?: CW3Types.Headers
  }) {
    this.ogmiosClient = OgmiosClient(ogmiosUrl, ogmiosHeaders)
    this.kupoClient = KupoClient(kupoUrl, kupoHeaders)
  }

  getTip = async (): Promise<CW3Types.Tip> => {
    const response = await this.ogmiosClient.GET("/health")
    if (response.data) {
      const tip = response.data as KupmiosProviderTypes.Health
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

  getProtocolParameters = async (): Promise<CW3Types.ProtocolParameters> => {
    const response = await this.ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "queryLedgerState/protocolParameters",
      } as any, // TODO: fix types,
    })
    if (response.data) {
      const data = response.data.result as any // TODD: fix types
      return ogmiosProtocolParametersToProtocolParameters(data)
    }
    throw new Error("Error: KupmiosProvider.getProtocolParameters")
  }

  getUtxosByAddresses = async (addresses: string[]): Promise<CW3Types.Utxo[]> => {
    try {
      const utxos: CW3Types.Utxo[] = []
      for (const address of addresses) {
        // TODO: fix types (?unspent=true problem, https://github.com/CardanoSolutions/kupo/issues/179)
        const response = await this.kupoClient.GET("/matches/{pattern}?unspent" as any, {
          params: {
            path: {
              pattern: address,
            },
            // query: {
            //   unspent: ""
            // }
          },
        })
        if (response.data) {
          utxos.push(...kupoUtxosToUtxos(response.data))
        }
      }
      return utxos
    } catch {
      throw new Error("Error: KupmiosProvider.getUtxosByAddresses")
    }
  }

  getUtxosByAddress = async (address: string): Promise<CW3Types.Utxo[]> => {
    return await this.getUtxosByAddresses([address])
  }

  getUtxoByOutputRef = async (txHash: string, index: number): Promise<CW3Types.Utxo> => {
    const response = await this.kupoClient.GET("/matches/{pattern}", {
      params: {
        path: {
          pattern: `${index}@${txHash}`,
        },
      },
    })
    if (response.data) {
      return kupoUtxoToUtxo(response.data[0])
    }
    throw new Error("Error: KupmiosProvider.getUtxoByTxRef")
  }

  resolveUtxoDatumAndScript = async (utxo: CW3Types.Utxo): Promise<CW3Types.Utxo> => {
    return {
      ...utxo,
      datum: utxo.datumHash ? await this.getDatumByHash(utxo.datumHash) : null,
      script: utxo.scriptHash ? await this.getScriptByHash(utxo.scriptHash) : null,
    }
  }

  resolveUtxosDatumAndScript = async (utxos: CW3Types.Utxo[]) => {
    return await Promise.all(
      utxos.map(async (utxo) => {
        return await this.resolveUtxoDatumAndScript(utxo)
      })
    )
  }

  getDatumByHash = async (datumHash: string): Promise<string | undefined> => {
    const response = await this.kupoClient.GET("/datums/{datum_hash}", {
      params: {
        path: {
          datum_hash: datumHash,
        },
      },
    })
    if (response.data) {
      return response.data.datum
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<CW3Types.Script | undefined> => {
    const response = await this.kupoClient.GET("/scripts/{script_hash}", {
      params: {
        path: {
          script_hash: scriptHash,
        },
      },
    })
    if (response.data) {
      return {
        language: kupoPlutusVersionToPlutusVersion(response.data.language),
        script: response.data.script,
      }
    }
    throw new Error("Error: KupmiosProvider.getDatumByhash")
  }

  getDelegation = async (stakingAddress: string): Promise<CW3Types.AccountDelegation> => {
    const response = await this.ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "queryLedgerState/rewardAccountSummaries",
        params: {
          keys: [stakingAddress],
        },
      } as any, // TODO: fix types
    })
    if (response.data) {
      const data = response.data as KupmiosProviderTypes.Delegation
      const delegation = Object.values((data.result || {}) as KupmiosProviderTypes.Delegation)?.[0]
      return {
        delegation: delegation?.delegate?.id,
        rewards: BigInt(delegation?.rewards?.ada?.lovelace || 0),
      }
    }
    throw new Error("Error: KupmiosProvider.getDelegation")
  }

  evaluateTx = async (tx: string, additionalUtxos?: CW3Types.Utxo[]): Promise<CW3Types.RedeemerCost[]> => {
    const response = await this.ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: {
          transaction: { cbor: tx },
          additionalUtxoSet: [], // TODO
        },
      } as any, // TODO: fix types
    })
    if (response.data) {
      const data = (response.data.result as CW3Types.RedeemerCost[]) || []
      return data
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KupmiosProvider.evaluateTx")
  }

  submitTx = async (tx: string): Promise<string> => {
    const response = await this.ogmiosClient.POST("/", {
      body: {
        jsonrpc: "2.0",
        method: "submitTransaction",
        params: {
          transaction: {
            cbor: tx,
          },
        },
      } as any, // TODO: fix types
    })
    if (response.data) {
      const data = response.data as any // TODO: fix types
      return data.result?.transaction?.id
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KupmiosProvider.submitTx")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await this.kupoClient.GET("/matches/{pattern}", {
        params: {
          path: {
            pattern: `*@${txHash}`,
          },
        },
      })
      if (response.data) {
        return response.data.length > 0
      }
      return false
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
}

const kupoUtxoToUtxo = (utxo: KupoTypes.components["schemas"]["Match"]): CW3Types.Utxo => {
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

const kupoUtxosToUtxos = (utxos: KupoTypes.components["schemas"]["Match"][]): CW3Types.Utxo[] => {
  return utxos.map((utxo) => kupoUtxoToUtxo(utxo))
}

const kupoAssetsToAssets = (assets: KupoTypes.components["schemas"]["Match"]["value"]["assets"]): CW3Types.Asset[] => {
  return Object.entries(assets).map(([id, quantity]): CW3Types.Asset => {
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

const ogmiosProtocolParametersToProtocolParameters = (pp: any): CW3Types.ProtocolParameters => {
  const scriptExecutionPricesMemory = pp.scriptExecutionPrices.memory.split("/")
  const scriptExecutionPricesCpu = pp.scriptExecutionPrices.cpu.split("/")
  return {
    minFeeA: parseInt(pp.minFeeCoefficient),
    minFeeB: parseInt(pp.minFeeConstant.ada.lovelace),
    maxTxSize: parseInt(pp.maxTransactionSize.bytes),
    maxValSize: parseInt(pp.maxValueSize.bytes),
    keyDeposit: BigInt(pp.stakeCredentialDeposit.ada.lovelace),
    poolDeposit: BigInt(pp.stakePoolDeposit.ada.lovelace),
    drepDeposit: BigInt(pp.delegateRepresentativeDeposit.ada.lovelace),
    govActionDeposit: BigInt(pp.governanceActionDeposit.ada.lovelace),
    priceMem: parseInt(scriptExecutionPricesMemory[0]) / parseInt(scriptExecutionPricesMemory[1]),
    priceStep: parseInt(scriptExecutionPricesCpu[0]) / parseInt(scriptExecutionPricesCpu[1]),
    maxTxExMem: BigInt(pp.maxExecutionUnitsPerTransaction.memory),
    maxTxExSteps: BigInt(pp.maxExecutionUnitsPerTransaction.cpu),
    coinsPerUtxoByte: BigInt(pp.minUtxoDepositCoefficient),
    collateralPercentage: parseInt(pp.collateralPercentage),
    maxCollateralInputs: parseInt(pp.maxCollateralInputs),
    minFeeRefScriptCostPerByte: parseInt(pp.minFeeReferenceScripts.base),
    costModels: {
      PlutusV1: pp.plutusCostModels["plutus:v1"],
      PlutusV2: pp.plutusCostModels["plutus:v2"],
      PlutusV3: pp.plutusCostModels["plutus:v3"],
    },
  }
}
