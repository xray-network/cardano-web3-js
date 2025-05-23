import NftcdnClient from "cardano-nftcdn-client"
import { CW3Types } from "@"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof NftcdnClient> => {
  return NftcdnClient(baseUrl, headers)
}
