import { CML, CW3Types } from "@"
import * as Bech32 from "bech32"

export const toDRep = (drep: CW3Types.DRep): CML.DRep => {
  if (drep === "AlwaysAbstain") {
    return CML.DRep.new_always_abstain()
  } else if (drep === "AlwaysNoConfidence") {
    return CML.DRep.new_always_no_confidence()
  } else {
    try {
      const drepCredentials = getDRepCredentials(drep)
      switch (drepCredentials.type) {
        case "key":
          return CML.DRep.new_key(CML.Ed25519KeyHash.from_hex(drepCredentials.hash))
        case "script":
          return CML.DRep.new_script(CML.ScriptHash.from_hex(drepCredentials.hash))
        default:
          throw new Error(`Unsupported DRep type: ${drepCredentials.type}`)
      }
    } catch (error) {
      throw new Error(`Unexpected DRep type: ${drep}`)
    }
  }
}

export const getDRepCredentials = (drepBech32: string): CW3Types.Credential => {
  const { words } = Bech32.bech32.decode(drepBech32)
  const payload = Bech32.bech32.fromWords(words)
  const header = payload[0]
  const hash = payload.slice(1)
  const isDrepGovCred = (header & 0x20) === 0x20
  const isScriptHash = (header & 0x03) === 0x03

  if (!isDrepGovCred) {
    throw new Error(`Invalid DRep Bech32 header: ${header}`)
  }

  return {
    type: isScriptHash ? "script" : "key",
    hash: Buffer.from(hash).toString("hex"),
  }
}
