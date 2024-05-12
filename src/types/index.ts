/** Ogmios types */
import type * as Ogmios from "@cardano-ogmios/schema"
export type * as Ogmios from "@cardano-ogmios/schema"

/** Core lib types */
import type { CML, MSL } from "../core/loader"
import type { C, M } from "../core/loader"
export type { C, M } from "../core/loader"
export type C = Awaited<ReturnType<typeof CML>>
export type M = Awaited<ReturnType<typeof MSL>>
import type { CardanoWeb3 } from "../core/cw3"
export type { CardanoWeb3 } from "../core/cw3"

/** Misc types */
export type Headers = {
  [key: string]: string
}

/** Account types */
export type { Account } from "../core/account"
export type AccountConfig = {
  xpubKey: string
  derivationPath: AccountDerivationPath | undefined
  changeAddress: string
  paymentCred: string
  stakingCred: string
  stakingAddress: string
}
export type AccountState = {
  utxos: Utxo[]
  balance: Balance
  delegation: string | undefined
  rewards: bigint
}
export type AccountDelegation = {
  delegation: string
  rewards: bigint
}

/** Provider types */
export interface Provider {
  getProtocolParameters(): Promise<ProtocolParameters>
  getUtxosByPaymentCred(paymentCred: string): Promise<Utxo[]>
  getDelegation(stakingAddress: string): Promise<AccountDelegation>
  getDatumByHash(datumHash: string): Promise<string | undefined>
  getScriptByHash(scriptHash: string): Promise<string | undefined>
  observeTx(txHash: string, checkInterval: number, maxTime: number): Promise<boolean>
  submitTx(tx: string): Promise<string>
}

/** Explorer types */
import type KoiosClientInstance from "cardano-koios-client"
import type NftcdnClientInstance from "cardano-nftcdn-client"
import type PricingClientInstance from "cardano-pricing-client"
export type KoiosClient = ReturnType<typeof KoiosClientInstance>
export type NftcdnClient = ReturnType<typeof NftcdnClientInstance>
export type PricingClient = ReturnType<typeof PricingClientInstance>
export type Explorer = {
  koios: KoiosClient
  nftcdn: NftcdnClient
  price: PricingClient
}

/** Connector types */
import type { Connector } from "../core/connector"
export type { Connector } from "../core/connector"
export type ConnectorPaginate = {
  page: number
  limit: number
}

/** CardanoWeb3 types */
export type Config = {
  network: NetworkConfig
  ttl: number
  remoteTxEvaluate?: boolean
  remoteProtocolParams?: boolean
}
export type InitConfig = {
  network?: NetworkName
  ttl?: number
  remoteTxEvaluate?: boolean
  remoteProtocolParams?: boolean
  provider?: Provider
  explorer?: {
    koios: {
      headers?: Headers
      url: string
    }
    nftcdn: {
      headers?: Headers
      url: string
    }
    pricing: {
      headers?: Headers
      url: string
    }
  }
}

/** Cardano types */
export type NetworkName = "mainnet" | "preprod" | "preview" | "custom"
export type NetworkType = "mainnet" | "testnet"
export type NetworkId = 0 | 1
export type NetworkConfig = {
  name: NetworkName
  type: NetworkType
  id: NetworkId
}
export type CostModels = Record<PlutusVersion, number[]>
export type PlutusVersion = "PlutusV1" | "PlutusV2"
export type ProtocolParameters = {
  minFeeA: number
  minFeeB: number
  maxTxSize: number
  maxValSize: number
  keyDeposit: bigint
  poolDeposit: bigint
  priceMem: number
  priceStep: number
  maxTxExMem: bigint
  maxTxExSteps: bigint
  coinsPerUtxoByte: bigint
  collateralPercentage: number
  maxCollateralInputs: number
  costModels: CostModels
}
export type AccountDerivationPath = [number, number, number]
export type AddressDerivationPath = [number, number]
export type Lovelace = bigint
export type Asset = {
  policyId: string
  assetName: string
  fingerprint: string
  quantity: bigint
}
export type Balance = {
  lovelace: Lovelace
  assets: Asset[]
}
export type Utxo = {
  transaction: {
    id: string
  }
  index: number
  address: string
  value: Lovelace
  assets: Asset[]
  datumHash?: string
  inlineDatum?: string
  scriptRef?: string
}
export type DerivationScheme = {
  purpose: {
    hdwallet: 1852
    multisig: 1854
    minting: 1855
    voting: 1694
  }
  coinType: {
    ada: 1815
  }
  account: {
    first: 0
  }
  role: {
    payment: 0
    change: 1
    stake: 2
  }
  index: {
    first: 0
  }
}
