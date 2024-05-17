import KoiosClient, { KoiosTypes } from "cardano-koios-client"
import AssetFingerprint from "@emurgo/cip14-js"
import { TTL } from "../config"
import * as T from "../types"

export class KoiosProvider implements T.Provider {
  private client: T.KoiosClient

  constructor(baseUrl: string, headers?: T.Headers) {
    this.client = KoiosClient(baseUrl, headers)
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
      const params = response.data[0]
      return {
        minFeeA: params.min_fee_a,
        minFeeB: params.min_fee_b,
        maxTxSize: params.max_tx_size,
        maxValSize: params.max_val_size,
        keyDeposit: BigInt(params.key_deposit),
        poolDeposit: BigInt(params.pool_deposit),
        priceMem: params.price_mem,
        priceStep: params.price_step,
        maxTxExMem: BigInt(params.max_tx_ex_mem),
        maxTxExSteps: BigInt(params.max_tx_ex_steps),
        coinsPerUtxoByte: BigInt(params.coins_per_utxo_size),
        collateralPercentage: params.collateral_percent,
        maxCollateralInputs: params.max_collateral_inputs,
        costModels: params.cost_models as any,
      }
    }
    throw new Error("Error: KoiosProvider.getProtocolParameters")
  }

  getUtxosByPaymentCred = async (paymentCred: string): Promise<T.Utxo[]> => {
    const response = await this.client.POST("/credential_utxos", {
      body: {
        _payment_credentials: [paymentCred],
        _extended: true,
      },
    })
    if (response.data) {
      return koiosUtxoToUtxo(response.data)
    }
    throw new Error("Error: KoiosProvider.getUtxosByPaymentCred")
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
        language:
          response.data[0]?.type === "plutusV1"
            ? "PlutusV1"
            : response.data[0]?.type === "plutusV2"
              ? "PlutusV2"
              : response.data[0]?.type,
        script: response.data[0]?.bytes,
      }
    }
    throw new Error("Error: KoiosProvider.getDatumByhash")
  }

  observeTx = (txHash: string, checkInterval: number = 3000, maxTime: number = TTL * 1000): Promise<boolean> => {
    const checkTx = async (interval?: ReturnType<typeof setInterval>) => {
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
}

const koiosUtxoToUtxo = (utxos: KoiosTypes.components["schemas"]["utxo_infos"]) => {
  return utxos.map((utxo): T.Utxo => {
    return {
      transaction: {
        id: utxo.tx_hash,
      },
      index: utxo.tx_index,
      address: utxo.address,
      value: BigInt(utxo.value),
      assets: koiosAssetsToAssets(utxo.asset_list || []),
      datumHash: utxo.datum_hash || null,
      scriptHash: utxo.reference_script?.hash || null,
    }
  })
}

const koiosAssetsToAssets = (
  assets: KoiosTypes.components["schemas"]["utxo_infos"][number]["asset_list"]
): T.Asset[] => {
  return assets.map((asset): T.Asset => {
    return {
      policyId: asset.policy_id,
      assetName: asset.asset_name || "",
      fingerprint: AssetFingerprint.fromParts(
        Buffer.from(asset.policy_id, "hex"),
        Buffer.from(asset.asset_name || "" || "", "hex")
      ).fingerprint(),
      quantity: BigInt(asset.quantity),
    }
  })
}
