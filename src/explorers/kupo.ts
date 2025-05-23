import KupoClient from "cardano-kupo-client"
import { CW3Types } from "@"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof KupoClient> => {
  return KupoClient(baseUrl, headers)
}
