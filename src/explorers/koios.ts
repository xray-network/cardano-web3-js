import KoiosClient from "cardano-koios-client"
import { CW3Types } from "@"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof KoiosClient> => {
  return KoiosClient(baseUrl, headers)
}
