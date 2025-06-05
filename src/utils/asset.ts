import * as Bech32 from "bech32"
import Blake2b from "blake2b"
import { Buffer } from "buffer"

export const getFingerprint = (policyId: string, assetName?: string): string => {
  const readablePart = "asset"
  const hashBuffer = Blake2b(20)
    .update(new Uint8Array([...Buffer.from(policyId, "hex"), ...Buffer.from(assetName || "", "hex")]))
    .digest("binary")
  const words = Bech32.bech32.toWords(hashBuffer)
  const fingerprint = Bech32.bech32.encode(readablePart, words)
  return fingerprint
}

export const assetNameToAssetNameAscii = (assetName: string): string => {
  return Buffer.from(assetName, "hex").toString("utf-8")
}
