import NftcdnClient from "cardano-nftcdn-client"
import * as CW3Types from "@/types"

export default (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof NftcdnClient> => {
  return NftcdnClient(baseUrl, headers)
}
