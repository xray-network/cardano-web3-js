import KoiosClient, { KoiosTypes } from "cardano-koios-client"
import { TTL } from "../../config"
import * as T from "../../types"

export class KoiosProvider implements T.Provider {
  private client: T.KoiosClient

  constructor(baseUrl: string, headers?: T.Headers) {
    this.client = KoiosClient(baseUrl, headers)
  }

  getTip = async (): Promise<T.Tip> => {
    const response = await this.client.GET("/tip", {})
    const tip = response.data?.[0]
    if (tip) {
      return {
        hash: tip.hash,
        epochNo: tip.epoch_no,
        absSlot: tip.abs_slot,
        epochSlot: tip.epoch_slot,
        blockNo: tip.block_no,
        blockTime: tip.block_time,
      }
    }
    throw new Error("Error: KoiosProvider.getTip")
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    const response = await this.client.GET("/epoch_params", {
      params: {
        query: {
          _epoch_no: undefined,
          limit: "1",
        },
      },
    })
    if (response.data) {
      return koiosProtocolParamsToProtocolParams(response.data[0])
    }
    throw new Error("Error: KoiosProvider.getProtocolParameters")
  }

  getUtxosByAddresses = async (addresses: string[]): Promise<T.Utxo[]> => {
    try {
      const utxos: T.Utxo[] = []
      let hasMore = true
      while (hasMore) {
        const response = await this.client.POST("/address_utxos", {
          body: {
            _addresses: addresses,
            _extended: true,
          },
        })
        if (response.data && response.data.length > 0) {
          utxos.push(...koiosUtxosToUtxos(response.data))
          if (response.data.length < 1000) {
            // Koios default limit
            hasMore = false
          }
        } else {
          hasMore = false
        }
      }
      return utxos
    } catch {
      throw new Error("Error: KoiosProvider.getUtxosByAddresses")
    }
  }

  getUtxosByAddress = async (address: string): Promise<T.Utxo[]> => {
    return await this.getUtxosByAddresses([address])
  }

  getUtxoByOutputRef = async (txHash: string, index: number): Promise<T.Utxo> => {
    const response = await this.client.POST("/utxo_info", {
      body: {
        _utxo_refs: [`${txHash}#${index}`],
        _extended: true,
      },
    })
    if (response.data) {
      return koiosUtxoToUtxo(response.data[0])
    }
    throw new Error("Error: KoiosProvider.getUtxoByTxRef")
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
    const response = await this.client.POST("/datum_info", {
      body: {
        _datum_hashes: [datumHash],
      },
    })
    if (response.data) {
      return response.data[0]?.bytes
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<T.Script | undefined> => {
    const response = await this.client.POST("/script_info", {
      body: {
        _script_hashes: [scriptHash],
      },
    })
    if (response.data) {
      return {
        language: koiosPlutusVersionToPlutusVersion(response.data[0]?.type),
        script: response.data[0]?.bytes,
      }
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    const response = await this.client.POST("/account_info", {
      body: {
        _stake_addresses: [stakingAddress],
      },
    })
    if (response.data) {
      const delegation = response.data[0]
      return {
        delegation: delegation?.delegated_pool,
        rewards: BigInt(delegation?.rewards_available || 0),
      }
    }
    throw new Error("Error: KoiosProvider.getDelegation")
  }

  evaluateTx = async (tx: string): Promise<T.RedeemerCost[]> => {
    const response = await this.client.POST("/ogmios", {
      headers: {
        "Content-Type": "application/cbor",
      },
      body: {
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: { transaction: { cbor: tx } },
      },
    })
    if (response.data) {
      return (response.data?.result as T.RedeemerCost[]) || []
    }
    throw new Error("Error: KoiosProvider.evaluateTx")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await this.client.POST("/tx_status", {
        body: {
          _tx_hashes: [txHash],
        },
      })
      return response.data && response.data[0].num_confirmations > 0
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
    const response = await this.client.POST("/submittx", {
      headers: {
        "Content-Type": "application/cbor",
      },
      body: tx,
    })
    if (response.data) {
      return response.data
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KoiosProvider.submitTx")
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

const koiosUtxoToUtxo = (utxo: KoiosTypes.components["schemas"]["utxo_infos"][number]): T.Utxo => {
  return {
    transaction: {
      id: utxo.tx_hash,
    },
    index: utxo.tx_index,
    address: utxo.address,
    value: BigInt(utxo.value),
    assets: koiosAssetsToAssets(utxo.asset_list || []),
    datumHash: utxo.datum_hash || null,
    datumType: utxo.datum_hash ? (utxo.inline_datum ? "inline" : "hash") : null,
    scriptHash: utxo.reference_script?.hash || null,
    datum: null,
    script: null,
  }
}

const koiosUtxosToUtxos = (utxos: KoiosTypes.components["schemas"]["utxo_infos"]): T.Utxo[] => {
  return utxos.map((utxo) => koiosUtxoToUtxo(utxo))
}

const koiosAssetsToAssets = (
  assets: KoiosTypes.components["schemas"]["utxo_infos"][number]["asset_list"]
): T.Asset[] => {
  return assets.map((asset): T.Asset => {
    return {
      policyId: asset.policy_id,
      assetName: asset.asset_name || "",
      quantity: BigInt(asset.quantity),
    }
  })
}

const koiosPlutusVersionToPlutusVersion = (plutusVersion: string) => {
  switch (plutusVersion) {
    case "plutusV1":
      return "PlutusV1"
    case "plutusV2":
      return "PlutusV2"
    case "plutusV3":
      return "PlutusV3"
    case "timelock":
      return "Native"
    case "multisig":
      return "Native"
    default:
      throw new Error("Invalid Plutus version")
  }
}

const koiosProtocolParamsToProtocolParams = (pp: KoiosTypes.components["schemas"]["epoch_params"][number]) => {
  return {
    minFeeA: pp.min_fee_a,
    minFeeB: pp.min_fee_b,
    maxTxSize: pp.max_tx_size,
    maxValSize: pp.max_val_size,
    keyDeposit: BigInt(pp.key_deposit),
    poolDeposit: BigInt(pp.pool_deposit),
    priceMem: pp.price_mem,
    priceStep: pp.price_step,
    maxTxExMem: BigInt(pp.max_tx_ex_mem),
    maxTxExSteps: BigInt(pp.max_tx_ex_steps),
    coinsPerUtxoByte: BigInt(pp.coins_per_utxo_size),
    collateralPercentage: pp.collateral_percent,
    maxCollateralInputs: pp.max_collateral_inputs,
    costModels: pp.cost_models as any,
  }
}
