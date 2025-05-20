import OgmiosClient from "cardano-ogmios-client"
import * as CW3Types from "@/types"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof OgmiosClient> => {
  return OgmiosClient(baseUrl, headers)
}
