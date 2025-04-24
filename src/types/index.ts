/** Account types */
export type AccountType = "xprv" | "xpub" | "connector" | "address" | "ledger" | "trezor"
export type AccountConfig = {
  configVersion: number
  type: AccountType
  checksumImage: string | undefined
  checksumId: string | undefined
  xpubKey: string
  xprvKey: string | undefined
  xprvKeyIsEncoded: boolean
  accountPath: AccountDerivationPath | undefined
  addressPath: AddressDerivationPath | undefined
  paymentAddress: string
  paymentCred: string
  stakingAddress: string | undefined
  stakingCred: string | undefined
  connector: Connector | undefined
}
export type AccountExportV1 = {
  configVersion: number
  type: AccountType
  xpubKey: string | undefined
  xprvKey: string | undefined
  xprvKeyIsEncoded: boolean
  accountPath: AccountDerivationPath | undefined
  addressPath: AddressDerivationPath | undefined
  paymentAddress: string
  stakingAddress: string | undefined
}
export type AccountState = {
  utxos: Utxo[]
  balance: Balance
}
export type AccountDelegation = {
  delegation: string | null
  rewards: bigint
}
export type AccountAddressDerivation = {
  address: string
  path: AddressDerivationPath
}
export type AccountMultiAddressing = {
  isMulti: boolean
  utxos: Utxo[]
  derivation: AccountAddressDerivation[]
}

/** Provider types */
export type Provider = {
  getTip: () => Promise<Tip>
  getProtocolParameters(): Promise<ProtocolParameters>
  getUtxosByAddresses(address: string[]): Promise<Utxo[]>
  getUtxosByAddress(address: string): Promise<Utxo[]>
  getUtxoByOutputRef(txHash: string, index: number): Promise<Utxo>
  resolveUtxoDatumAndScript(utxo: Utxo): Promise<Utxo>
  getDatumByHash(datumHash: string): Promise<string | undefined>
  getScriptByHash(scriptHash: string): Promise<Script | undefined>
  getDelegation(stakingAddress: string): Promise<AccountDelegation>
  evaluateTx(tx: string, additionalUtxos?: Utxo[]): Promise<RedeemerCost[]>
  submitTx(tx: string): Promise<string>
  observeTx(txHash: string, checkInterval?: number, maxTime?: number): Promise<boolean>
}

/** Explorer types */
import type KoiosClientInstance from "cardano-koios-client"
import type NftcdnClientInstance from "cardano-nftcdn-client"
export type KoiosClient = ReturnType<typeof KoiosClientInstance>
export type NftcdnClient = ReturnType<typeof NftcdnClientInstance>
export type Explorers = {
  koios: KoiosClient
  nftcdn: NftcdnClient
}

/** Connector types */
import type { Connector } from "./links"
export type ConnectorPaginate = {
  page: number
  limit: number
}

/** CardanoWeb3 types */
export type InitConfig = {
  network?: NetworkName
  protocolParams?: ProtocolParameters
  slotConfig?: SlotConfig
  ttl?: number
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
export type Tip = {
  hash: string
  epochNo: number
  absSlot: number
  epochSlot: number
  blockNo: number
  blockTime: number
}
export type SlotConfig = {
  zeroTime: number
  zeroSlot: number
  slotDuration: number
}
export type CostModels = Record<PlutusVersion, number[]>
export type PlutusVersion = "PlutusV1" | "PlutusV2" | "PlutusV3"
export type Script = {
  language: PlutusVersion | "Native"
  script: string
}
export type NativeScript = {
  type: "sig" | "all" | "any" | "before" | "atLeast" | "after"
  keyHash?: string
  required?: number
  slot?: number
  scripts?: NativeScript[]
}
export type NativeConfig =
  | { type: "sig"; keyHash: string }
  | { type: "before"; slot: number }
  | { type: "after"; slot: number }
  | { type: "all"; scripts: ReadonlyArray<NativeConfig> }
  | { type: "any"; scripts: ReadonlyArray<NativeConfig> }
  | { type: "atLeast"; required: number; scripts: ReadonlyArray<NativeConfig> }
export type NativeScriptType =
  | { ScriptPubkey: { ed25519_key_hash: string } }
  | { ScriptInvalidBefore: { before: number } }
  | { ScriptInvalidHereafter: { after: number } }
  | { ScriptAll: { native_scripts: ReadonlyArray<NativeScriptType> } }
  | { ScriptAny: { native_scripts: ReadonlyArray<NativeScriptType> } }
  | { ScriptNOfK: { n: number; native_scripts: ReadonlyArray<NativeScriptType> } }
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
  minFeeRefScriptCostPerByte: number
  costModels: CostModels
}
export type AccountDerivationPath = [number, number, number]
export type AddressDerivationPath = [number, number]
export type AddressType = "base" | "pointer" | "enterprise" | "reward" | "byron"
export type AddressCredentialType = "key" | "script"
export type Credential = {
  type: AddressCredentialType
  hash: string
}
export type AddressPublicCredentials = {
  type: AddressType
  paymentCred?: Credential
  stakingCred?: Credential
}
export type Redeemer = string
export type RedeemerCost = {
  validator: string
  budget: {
    memory: number
    cpu: number
  }
}
export type Datum = string
export type DatumType = "inline" | "hash"
export type DatumOutput = {
  type: DatumType
  datum: Datum
}
export type Value = bigint
export type Asset = {
  policyId: string
  assetName: string
  quantity: bigint
  decimals?: number
}
export type Balance = {
  value: Value
  assets: (Asset & {
    fingerprint: string
    assetNameAscii: string
  })[]
}
export type Utxo = {
  transaction: {
    id: string
  }
  index: number
  address: string
  value: Value
  assets: Asset[]
  datumHash: string | null
  datumType: DatumType | null
  scriptHash: string | null
  datum?: Datum | null
  script?: Script | null
}
export type Output = {
  address: string
  value?: Value
  assets?: Asset[]
}
export type CollateralConfig = {
  utxo: Utxo | undefined
  auto: boolean
  excludeFromInputs: boolean
}
export type PoolConfig = {
  poolId: string
  vrfKeyHash: string
  pledge: bigint
  cost: bigint
  margin: [bigint, bigint]
  rewardAddress: string
  owners: Array<string>
  relays: Array<RelayConfig>
  metadataUrl?: string
}
export type RelayConfig = {
  type: "SingleHostIp" | "SingleHostDomainName" | "MultiHost"
  ipV4?: string
  ipV6?: string
  port?: number
  domainName?: string
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

/** Misc types */
export type Json = any
export type OmitFirstArg<F> = F extends (arg1: any, ...args: infer P) => infer R ? (...args: P) => R : never
export type Exact<T> = T extends infer U ? U : never
export type SignedMessage = { signature: string; key: string }
export type Headers = {
  [key: string]: string
}
