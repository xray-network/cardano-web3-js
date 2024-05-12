import NftcdnClient from "cardano-nftcdn-client"
import * as T from "../types"

export default (baseUrl: string, headers?: T.Headers): ReturnType<typeof NftcdnClient> => {
  return NftcdnClient(baseUrl, headers)
}
