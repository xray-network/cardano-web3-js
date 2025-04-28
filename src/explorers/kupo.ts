import KupoClient from "cardano-kupo-client"
import * as CW3Types from "../types"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof KupoClient> => {
  return KupoClient(baseUrl, headers)
}
