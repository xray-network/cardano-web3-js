export type * as C from "@dcspark/cardano-multiplatform-lib-nodejs/cardano_multiplatform_lib.js"
export type * as M from "@emurgo/cardano-message-signing-nodejs/cardano_message_signing.js"

export const CML = async () => {
  try {
    return await import("@dcspark/cardano-multiplatform-lib-nodejs/cardano_multiplatform_lib.js")
  } catch (_e) {
    return null
  }
}

export const MSL = async () => {
  try {
    return await import("@emurgo/cardano-message-signing-nodejs/cardano_message_signing.js")
  } catch (_e) {
    return null
  }
}
