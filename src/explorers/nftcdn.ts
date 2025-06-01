import __NftcdnClient from "cardano-nftcdn-client"
import { CW3Types } from "@"
export type { NftcdnTypes } from "cardano-nftcdn-client"

export const NftcdnClient = (baseUrl: string, headers?: CW3Types.Headers): ReturnType<typeof __NftcdnClient> => {
  return __NftcdnClient(baseUrl, headers)
}
