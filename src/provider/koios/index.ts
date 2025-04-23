import { TTL } from "../../config"
import * as T from "../../types"
import * as KoiosProviderTypes from "./types"

export class KoiosProvider implements T.Provider {
  private baseUrl: string
  private headers: T.Headers

  constructor(baseUrl: string, headers?: T.Headers) {
    this.baseUrl = baseUrl
    this.headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...headers,
    }
  }

  getTip = async (): Promise<T.Tip> => {
    const response = await fetch(`${this.baseUrl}/tip`, {
      headers: this.headers,
    })
    if (response.ok) {
      const data = (await response.json())[0] as any
      return {
        hash: data.hash,
        epochNo: data.epoch_no,
        absSlot: data.abs_slot,
        epochSlot: data.epoch_slot,
        blockNo: data.block_no,
        blockTime: data.block_time,
      }
    }
    throw new Error("Error: KoiosProvider.getTip")
  }

  getProtocolParameters = async (): Promise<T.ProtocolParameters> => {
    const response = await fetch(`${this.baseUrl}/epoch_params?limit=1`, {
      headers: this.headers,
      method: "POST",
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      return koiosProtocolParamsToProtocolParams(data[0])
    }
    throw new Error("Error: KoiosProvider.getProtocolParameters")
  }

  getUtxosByAddresses = async (addresses: string[]): Promise<T.Utxo[]> => {
    try {
      const utxos: T.Utxo[] = []
      let hasMore = true
      while (hasMore) {
        const response = await fetch(`${this.baseUrl}/address_utxos`, {
          headers: this.headers,
          method: "POST",
          body: JSON.stringify({
            _addresses: addresses,
            _extended: true,
          }),
        })
        if (response.ok) {
          const data = (await response.json()) as any // TODO TYPES
          if (data.length > 0) {
            utxos.push(...koiosUtxosToUtxos(data))
            // Koios default response limit = 1000
            if (data.length < 1000) {
              hasMore = false
            }
          } else {
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
    const response = await fetch(`${this.baseUrl}/utxo_info`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        _utxo_refs: [`${txHash}#${index}`],
        _extended: true,
      }),
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      return koiosUtxoToUtxo(data[0])
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
    const response = await fetch(`${this.baseUrl}/datum_info`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        _datum_hashes: [datumHash],
      }),
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      return data[0]?.bytes
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  getScriptByHash = async (scriptHash: string): Promise<T.Script | undefined> => {
    const response = await fetch(`${this.baseUrl}/script_info`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        _script_hashes: [scriptHash],
      }),
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      console.log(data)
      return {
        language: koiosPlutusVersionToPlutusVersion(data[0]?.type),
        script: data[0]?.bytes,
      }
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  getDelegation = async (stakingAddress: string): Promise<T.AccountDelegation> => {
    const response = await fetch(`${this.baseUrl}/account_info`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        _stake_addresses: [stakingAddress],
      }),
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      const delegation = data[0]
      return {
        delegation: delegation?.delegated_pool,
        rewards: BigInt(delegation?.rewards_available || 0),
      }
    }
    throw new Error("Error: KoiosProvider.getDelegation")
  }

  evaluateTx = async (tx: string, additionalUtxos?: T.Utxo[]): Promise<T.RedeemerCost[]> => {
    const response = await fetch(`${this.baseUrl}/ogmios`, {
      headers: this.headers,
      method: "POST",
      body: JSON.stringify({
        jsonrpc: "2.0",
        method: "evaluateTransaction",
        params: {
          transaction: { cbor: tx },
          // additionalUtxoSet: [] TODO
        },
      }),
    })
    if (response.ok) {
      const data = (await response.json()) as any // TODO TYPES
      console.log(data)
      return (data?.result as T.RedeemerCost[]) || []
    }
    if (!response.ok) {
      throw new Error(await response.json())
    }
    
    throw new Error("Error: KoiosProvider.evaluateTx")
  }

  submitTx = async (tx: string): Promise<string> => {
    console.log(`${this.baseUrl}/submittx`)
    const response = await fetch(`${this.baseUrl}/submittx`, {
      headers: {
        ...this.headers,
        "Content-Type": "application/cbor",
      },
      method: "POST",
      body: JSON.stringify(tx),
    })
    if (response.ok) {
      return await response.text()
    } 
    if (!response.ok) {
      throw new Error(await response.text())
    }
    throw new Error("Error: KoiosProvider.submitTx")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async () => {
      const response = await fetch(`${this.baseUrl}/tx_status`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify({
          _tx_hashes: [txHash],
        }),
      })
      const data = await response.json() as any // TODO TYPES
      return data?.[0]?.num_confirmations > 0
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

const koiosUtxoToUtxo = (utxo: KoiosProviderTypes.Utxo): T.Utxo => {
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

const koiosUtxosToUtxos = (utxos: KoiosProviderTypes.Utxo[]): T.Utxo[] => {
  return utxos.map((utxo) => koiosUtxoToUtxo(utxo))
}

const koiosAssetsToAssets = (assets: KoiosProviderTypes.Utxo["asset_list"]): T.Asset[] => {
  return assets.map((asset): T.Asset => {
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

const koiosProtocolParamsToProtocolParams = (pp: any): T.ProtocolParameters => {
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
    minFeeRefScriptCostPerByte: pp.min_fee_ref_script_cost_per_byte,
    costModels: pp.cost_models as any,
  }
}
