export type Delegation = {
  [k: string]: {
    delegate: { id: string }
    rewards: { ada: { lovelace: string } }
    deposit: { ada: { lovelace: string } }
  }
}
export type Assets = {
  [k: string]: string
}
export type Utxo = {
  transaction_index: number
  transaction_id: string
  output_index: number
  address: string
  value: {
    coins: string
    assets: Assets
  }
  datum_hash: string | null
  datum_type: "hash" | "inline"
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
export type Health = {
  startTime: string
  lastKnownTip: {
    slot: number
    id: string
    height: number
  }
  lastTipUpdate: string
  networkSynchronization: number
  currentEra: string
  metrics: {
    activeConnections: number
    runtimeStats: {
      cpuTime: number
      currentHeapSize: number
      gcCpuTime: number
      maxHeapSize: number
    }
    sessionDurations: {
      max: number
      mean: number
      min: number
    }
    totalConnections: number
    totalMessages: number
    totalUnrouted: number
  }
  connectionStatus: string
  currentEpoch: number
  slotInEpoch: number
  version: string
  network: string
}
