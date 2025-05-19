import KoiosClient, { KoiosTypes } from "cardano-koios-client"
import { TTL } from "../../config"
import * as CW3Types from "../../types"

export class KoiosProvider implements CW3Types.Provider {
  private koiosClient: CW3Types.KoiosClient

  constructor(baseUrl: string, headers?: CW3Types.Headers) {
    this.koiosClient = KoiosClient(baseUrl, headers)
  }

  getTip = async (): Promise<CW3Types.Tip> => {
    const response = await this.koiosClient.GET("/tip", {})
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

  getProtocolParameters = async (): Promise<CW3Types.ProtocolParameters> => {
    const response = await this.koiosClient.GET("/epoch_params", {
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

  getUtxosByAddresses = async (addresses: string[]): Promise<CW3Types.Utxo[]> => {
    try {
      const utxos: CW3Types.Utxo[] = []
      let hasMore = true
      while (hasMore) {
        const response = await this.koiosClient.POST("/address_utxos", {
          body: {
            _addresses: addresses,
            _extended: true,
          },
        })
        if (response.data && response.data.length > 0) {
          utxos.push(...koiosUtxosToUtxos(response.data))
          // Koios default limit
          if (response.data.length < 1000) {
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

  getUtxosByAddress = async (address: string): Promise<CW3Types.Utxo[]> => {
    return await this.getUtxosByAddresses([address])
  }

  getUtxoByOutputRef = async (txHash: string, index: number): Promise<CW3Types.Utxo> => {
    const response = await this.koiosClient.POST("/utxo_info", {
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
    const response = await this.koiosClient.POST("/datum_info", {
      body: {
        _datum_hashes: [datumHash],
      },
    })
    if (response.data) {
      return response.data[0]?.bytes
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<CW3Types.Script | undefined> => {
    const response = await this.koiosClient.POST("/script_info", {
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

  getDelegation = async (stakingAddress: string): Promise<CW3Types.AccountDelegation> => {
    const response = await this.koiosClient.POST("/account_info", {
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

  evaluateTx = async (tx: string, additionalUtxos?: CW3Types.Utxo[]): Promise<CW3Types.RedeemerCost[]> => {
    const response = await this.koiosClient.POST("/ogmios", {
      parseAs: "text",
      headers: {
        "Content-Type": "application/json",
      },
      body: {
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: {
          transaction: { cbor: tx },
          additionalUtxoSet: [], // TODO
        } as any, // TODO: fix types
      },
    })
    if (response.data) {
      if (response.data.result) {
        return response.data.result as CW3Types.RedeemerCost[]
      } else {
        throw new Error(JSON.stringify(response.data))
      }
    }
    if (response.error) {
      throw new Error(JSON.stringify(response.error))
    }
    throw new Error("Error: KoiosProvider.evaluateTx")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await this.koiosClient.POST("/tx_status", {
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
    const response = await this.koiosClient.POST("/submittx", {
      parseAs: "text",
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

const koiosUtxoToUtxo = (utxo: KoiosTypes.components["schemas"]["utxo_infos"][number]): CW3Types.Utxo => {
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

const koiosUtxosToUtxos = (utxos: KoiosTypes.components["schemas"]["utxo_infos"]): CW3Types.Utxo[] => {
  return utxos.map((utxo) => koiosUtxoToUtxo(utxo))
}

const koiosAssetsToAssets = (
  assets: KoiosTypes.components["schemas"]["utxo_infos"][number]["asset_list"]
): CW3Types.Asset[] => {
  return assets.map((asset): CW3Types.Asset => {
    return {
      policyId: asset.policy_id,
      assetName: asset.asset_name || "",
      quantity: BigInt(asset.quantity),
      decimals: asset.decimals,
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

const koiosProtocolParamsToProtocolParams = (
  pp: KoiosTypes.components["schemas"]["epoch_params"][number]
): CW3Types.ProtocolParameters => {
  return {
    minFeeA: pp.min_fee_a,
    minFeeB: pp.min_fee_b,
    maxTxSize: pp.max_tx_size,
    maxValSize: pp.max_val_size,
    keyDeposit: BigInt(pp.key_deposit),
    poolDeposit: BigInt(pp.pool_deposit),
    drepDeposit: BigInt(pp.drep_deposit),
    govActionDeposit: BigInt(pp.gov_action_deposit),
    priceMem: pp.price_mem,
    priceStep: pp.price_step,
    maxTxExMem: BigInt(pp.max_tx_ex_mem),
    maxTxExSteps: BigInt(pp.max_tx_ex_steps),
    coinsPerUtxoByte: BigInt(pp.coins_per_utxo_size),
    collateralPercentage: pp.collateral_percent,
    maxCollateralInputs: pp.max_collateral_inputs,
    minFeeRefScriptCostPerByte: pp.min_fee_ref_script_cost_per_byte,
    costModels: pp.cost_models as any,
  }
}
