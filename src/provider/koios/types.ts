export type Utxo = {
  tx_hash?: string
  tx_index?: number
  address?: string
  value?: string
  stake_address?: string | null
  payment_cred?: string | null
  epoch_no?: number
  block_height?: number | null
  block_time?: number | null
  datum_hash?: string | null
  inline_datum?: {
    bytes?: string
    value?: Record<string, never>
  } | null
  reference_script?: {
    hash?: string
    size?: number
    type?: string
    bytes?: string
    value?: Record<string, never> | null
  } | null
  asset_list?:
    | {
        policy_id?: string
        asset_name?: string | null
        fingerprint?: string
        decimals?: number
        quantity?: string
      }[]
    | null
  is_spent?: boolean
}
