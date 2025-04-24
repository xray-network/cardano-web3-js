import KoiosClient from "cardano-koios-client"
import * as CW3Types from "../types"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof KoiosClient> => {
  return KoiosClient(baseUrl, headers)
}
