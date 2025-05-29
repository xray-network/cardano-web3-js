import __KupoClient from "cardano-kupo-client"
import { CW3Types } from "@"
export type { KupoTypes } from "cardano-kupo-client"

export const KupoClient = (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof __KupoClient> => {
  return __KupoClient(baseUrl, headers)
}
