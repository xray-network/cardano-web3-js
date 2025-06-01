import __OgmiosClient from "cardano-ogmios-client"
import { CW3Types } from "@"
export type { OgmiosTypes } from "cardano-ogmios-client"

export const OgmiosClient = (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof __OgmiosClient> => {
  return __OgmiosClient(baseUrl, headers)
}
