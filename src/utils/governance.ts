import { CML, CW3Types } from "@"

export const isDRepCredential = (drep: CW3Types.DRep): drep is CW3Types.Credential => {
  return !("__typename" in drep)
}

export const isDRepAlwaysAbstain = (drep: CW3Types.DRep): drep is CW3Types.AlwaysAbstain => {
  return !isDRepCredential(drep) && drep.__typename === "AlwaysAbstain"
}

export const isDRepAlwaysNoConfidence = (drep: CW3Types.DRep): drep is CW3Types.AlwaysNoConfidence => {
  return !isDRepCredential(drep) && drep.__typename === "AlwaysAbstain"
}

export const toDrep = (drep: CW3Types.DRep): CML.DRep => {
  if (isDRepAlwaysAbstain(drep)) {
    return CML.DRep.new_always_abstain()
  } else if (isDRepAlwaysNoConfidence(drep)) {
    return CML.DRep.new_always_no_confidence()
  } else if (isDRepCredential(drep)) {
    switch (drep.type) {
      case "key":
        return CML.DRep.new_key(CML.Ed25519KeyHash.from_hex(drep.hash))
      case "script":
        return CML.DRep.new_script(CML.ScriptHash.from_hex(drep.hash))
      default:
        throw new Error(`Unsupported DRep type: ${drep.type}`)
    }
  }
  throw new Error(`Unexpected DRep type: ${drep}`)
}
