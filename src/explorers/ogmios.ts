import OgmiosClient from "cardano-ogmios-client"
import { CW3Types } from "@"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof OgmiosClient> => {
  return OgmiosClient(baseUrl, headers)
}
