import KoiosClient from "cardano-koios-client"
import * as T from "../types"

export default (baseUrl: string, headers?: T.Headers): ReturnType<typeof KoiosClient> => {
  return KoiosClient(baseUrl, headers)
}
