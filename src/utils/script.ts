import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import UPLC from "uplc-node"
import * as CBOR from "cbor-x"
import { Data as PlutusData, Constr as PlutusConstr } from "./libs/plutusData"
import { fromHex, toHex } from "./misc"
import * as CW3Types from "@/types"

export const scriptToScriptRef = (script: CW3Types.Script): CML.Script => {
  switch (script.language) {
    case "Native":
      return CML.Script.new_native(CML.NativeScript.from_cbor_hex(script.script))
    case "PlutusV1":
      return CML.Script.new_plutus_v1(CML.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    case "PlutusV2":
      return CML.Script.new_plutus_v2(CML.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    case "PlutusV3":
      return CML.Script.new_plutus_v3(CML.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    default:
      throw new Error("scriptToScriptRef: Wrong script language")
  }
}

export const scriptToAddress = (
  script: CW3Types.Script,
  netoworkId: CW3Types.NetworkId,
  stakeCredential?: CW3Types.Credential
): string => {
  const validatorHash = scriptToScriptHash(script)
  if (stakeCredential) {
    return CML.BaseAddress.new(
      netoworkId,
      CML.Credential.new_script(CML.ScriptHash.from_hex(validatorHash)),
      stakeCredential.type === "key"
        ? CML.Credential.new_pub_key(CML.Ed25519KeyHash.from_hex(stakeCredential.hash))
        : CML.Credential.new_script(CML.ScriptHash.from_hex(stakeCredential.hash))
    )
      .to_address()
      .to_bech32(undefined)
  } else {
    return CML.EnterpriseAddress.new(netoworkId, CML.Credential.new_script(CML.ScriptHash.from_hex(validatorHash)))
      .to_address()
      .to_bech32(undefined)
  }
}

export const scriptToPlutusScript = (script: CW3Types.Script): CML.PlutusScript => {
  switch (script.language) {
    case "PlutusV1":
      return CML.PlutusScript.from_v1(CML.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    case "PlutusV2":
      return CML.PlutusScript.from_v2(CML.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    case "PlutusV3":
      return CML.PlutusScript.from_v3(CML.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
    default:
      throw new Error("scriptToPlutusScript: Wrong script language")
  }
}

export const scriptToScriptHash = (script: CW3Types.Script): string => {
  switch (script.language) {
    case "Native":
      return CML.NativeScript.from_cbor_hex(script.script).hash().to_hex()
    case "PlutusV1":
      return CML.PlutusScript.from_v1(CML.PlutusV1Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
        .hash()
        .to_hex()
    case "PlutusV2":
      return CML.PlutusScript.from_v2(CML.PlutusV2Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
        .hash()
        .to_hex()
    case "PlutusV3":
      return CML.PlutusScript.from_v3(CML.PlutusV3Script.from_cbor_hex(applyDoubleCborEncoding(script.script)))
        .hash()
        .to_hex()
    default:
      throw new Error("scriptToScriptHash: Wrong script language")
  }
}

export const partialPlutusWitness = (script: CML.PlutusScript, redeemer: string): CML.PartialPlutusWitness => {
  return CML.PartialPlutusWitness.new(
    CML.PlutusScriptWitness.new_script(script),
    CML.PlutusData.from_cbor_hex(redeemer)
  )
}

export const applyDoubleCborEncoding = (script: string): string => {
  try {
    CBOR.decode(CBOR.decode(fromHex(script)))
    return script
  } catch {
    try {
      CBOR.decode(fromHex(script))
      return toHex(Uint8Array.from(CBOR.encode(fromHex(script).buffer)))
    } catch {
      return toHex(Uint8Array.from(CBOR.encode(CBOR.encode(fromHex(script).buffer))))
    }
  }
}

export const nativeScriptFromJson = (
  json: CW3Types.NativeConfig
): {
  policyId: string
  script: CW3Types.Script
} => {
  const parseNativeScript = (json: CW3Types.NativeConfig) => {
    switch (json.type) {
      case "sig":
        return CML.NativeScript.new_script_pubkey(CML.Ed25519KeyHash.from_hex(json.keyHash))
      case "before":
        return CML.NativeScript.new_script_invalid_hereafter(BigInt(json.slot))
      case "after":
        return CML.NativeScript.new_script_invalid_before(BigInt(json.slot))
      case "all": {
        const nativeList = CML.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CML.NativeScript.new_script_all(nativeList)
      }
      case "any": {
        const nativeList = CML.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CML.NativeScript.new_script_any(nativeList)
      }
      case "atLeast": {
        const nativeList = CML.NativeScriptList.new()
        json.scripts.map((script) => nativeList.add(parseNativeScript(script)))
        return CML.NativeScript.new_script_n_of_k(BigInt(json.required), nativeList)
      }
    }
  }
  const script: CW3Types.Script = {
    language: "Native",
    script: parseNativeScript(json).to_cbor_hex(),
  }
  const policyId = scriptToScriptHash(script)
  return {
    policyId,
    script,
  }
}

export const applyParamsToScript = <T extends unknown[] = PlutusData[]>(
  plutusScript: string,
  params: CW3Types.Exact<[...T]>,
  type?: T
): string => {
  const p = (type ? PlutusData.castTo<T>(params, type) : params) as PlutusData[]
  return toHex(UPLC.apply_params_to_script(fromHex(PlutusData.to(p)), fromHex(plutusScript)))
}
