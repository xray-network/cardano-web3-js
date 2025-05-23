import { Buffer } from "buffer"
import { CML, MSL, CW3Types } from "@"

const fromHex = (hex: string): Uint8Array => {
  return new Uint8Array(Buffer.from(hex, "hex"))
}

const toHex = (bytes: Uint8Array): string => {
  return Buffer.from(bytes).toString("hex")
}

export const MessageFunc = () => {
  return {
    signData: (addressHex: string, payload: string, privateKey: string): CW3Types.SignedMessage => {
      const protectedHeaders = MSL.HeaderMap.new()
      protectedHeaders.set_algorithm_id(MSL.Label.from_algorithm_id(MSL.AlgorithmId.EdDSA))
      protectedHeaders.set_header(MSL.Label.new_text("address"), MSL.CBORValue.new_bytes(fromHex(addressHex)))
      const protectedSerialized = MSL.ProtectedHeaderMap.new(protectedHeaders)
      const unprotectedHeaders = MSL.HeaderMap.new()
      const headers = MSL.Headers.new(protectedSerialized, unprotectedHeaders)
      const builder = MSL.COSESign1Builder.new(headers, fromHex(payload), false)
      const toSign = builder.make_data_to_sign().to_bytes()

      const priv = CML.PrivateKey.from_bech32(privateKey)

      const signedSigStruc = priv.sign(toSign).to_raw_bytes()
      const coseSign1 = builder.build(signedSigStruc)

      const key = MSL.COSEKey.new(
        MSL.Label.from_key_type(MSL.KeyType.OKP) //OKP
      )
      key.set_algorithm_id(MSL.Label.from_algorithm_id(MSL.AlgorithmId.EdDSA))
      key.set_header(
        MSL.Label.new_int(MSL.Int.new_negative(MSL.BigNum.from_str("1"))),
        MSL.CBORValue.new_int(
          MSL.Int.new_i32(6) //MSL.CurveType.Ed25519
        )
      ) // crv (-1) set to Ed25519 (6)
      key.set_header(
        MSL.Label.new_int(MSL.Int.new_negative(MSL.BigNum.from_str("2"))),
        MSL.CBORValue.new_bytes(priv.to_public().to_raw_bytes())
      ) // x (-2) set to public key

      return {
        signature: toHex(coseSign1.to_bytes()),
        key: toHex(key.to_bytes()),
      }
    },
    verifyData: (
      addressHex: string,
      keyHash: string,
      payload: string,
      signedMessage: CW3Types.SignedMessage
    ): boolean => {
      const cose1 = MSL.COSESign1.from_bytes(fromHex(signedMessage.signature))
      const key = MSL.COSEKey.from_bytes(fromHex(signedMessage.key))

      const protectedHeaders = cose1.headers().protected().deserialized_headers()

      const cose1Address = (() => {
        try {
          return toHex(protectedHeaders.header(MSL.Label.new_text("address"))?.as_bytes()!)
        } catch (_e) {
          throw new Error("No address found in signature.")
        }
      })()

      const cose1AlgorithmId = (() => {
        try {
          const int = protectedHeaders.algorithm_id()?.as_int()
          if (int?.is_positive()) return parseInt(int.as_positive()?.to_str()!)
          return parseInt(int?.as_negative()?.to_str()!)
        } catch (_e) {
          throw new Error("Failed to retrieve Algorithm Id.")
        }
      })()

      const keyAlgorithmId = (() => {
        try {
          const int = key.algorithm_id()?.as_int()
          if (int?.is_positive()) return parseInt(int.as_positive()?.to_str()!)
          return parseInt(int?.as_negative()?.to_str()!)
        } catch (_e) {
          throw new Error("Failed to retrieve Algorithm Id.")
        }
      })()

      const keyCurve = (() => {
        try {
          const int = key.header(MSL.Label.new_int(MSL.Int.new_negative(MSL.BigNum.from_str("1"))))?.as_int()
          if (int?.is_positive()) return parseInt(int.as_positive()?.to_str()!)
          return parseInt(int?.as_negative()?.to_str()!)
        } catch (_e) {
          throw new Error("Failed to retrieve Curve.")
        }
      })()

      const keyType = (() => {
        try {
          const int = key.key_type().as_int()
          if (int?.is_positive()) return parseInt(int.as_positive()?.to_str()!)
          return parseInt(int?.as_negative()?.to_str()!)
        } catch (_e) {
          throw new Error("Failed to retrieve Key Type.")
        }
      })()

      const publicKey = (() => {
        try {
          return CML.PublicKey.from_bytes(
            key.header(MSL.Label.new_int(MSL.Int.new_negative(MSL.BigNum.from_str("2"))))?.as_bytes()!
          )
        } catch (_e) {
          throw new Error("No public key found.")
        }
      })()

      const cose1Payload = (() => {
        try {
          return toHex(cose1.payload()!)
        } catch (_e) {
          throw new Error("No payload found.")
        }
      })()

      const signature = CML.Ed25519Signature.from_raw_bytes(cose1.signature())

      const data = cose1.signed_data(undefined, undefined).to_bytes()

      if (cose1Address !== addressHex) return false

      if (keyHash !== publicKey.hash().to_hex()) return false

      if (cose1AlgorithmId !== keyAlgorithmId && cose1AlgorithmId !== MSL.AlgorithmId.EdDSA) {
        return false
      }

      if (keyCurve !== 6) return false

      if (keyType !== 1) return false

      if (cose1Payload !== payload) return false

      return publicKey.verify(data, signature)
    },
  }
}

export const Message = MessageFunc()
