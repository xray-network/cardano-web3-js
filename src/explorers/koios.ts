import __KoiosClient, { KoiosTypes } from "cardano-koios-client"
import { CW3Types } from "@"
export type { KoiosTypes } from "cardano-koios-client"

export const KoiosClient = (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof __KoiosClient> => {
  return __KoiosClient(baseUrl, headers)
}
