import { CML, CW3Types } from "@"
import { Buffer } from "buffer"

export const harden = (num: number): number => {
  return 0x80000000 + num
}

export const fromHex = (hex: string): Uint8Array => {
  return new Uint8Array(Buffer.from(hex, "hex"))
}

export const toHex = (bytes: Uint8Array): string => {
  return Buffer.from(bytes).toString("hex")
}

export const toStringFromHex = (hex: string): string => {
  return Buffer.from(hex, "hex").toString()
}

export const fromStringToHex = (text: string): string => {
  return Buffer.from(text).toString("hex")
}

export const encryptDataWithPass = (data: string, password: string): string => {
  return CML.emip3_encrypt_with_password(
    Buffer.from(password).toString("hex"),
    Buffer.from(randomBytes(32)).toString("hex"),
    Buffer.from(randomBytes(12)).toString("hex"),
    Buffer.from(data).toString("hex")
  )
}

export const decryptDataWithPass = (data: string, password: string): string => {
  return Buffer.from(CML.emip3_decrypt_with_password(Buffer.from(password).toString("hex"), data), "hex").toString()
}

export const randomBytes = (length: number): Uint8Array => {
  if (typeof window !== "undefined" && window.crypto) {
    const bytes = new Uint8Array(length)
    window.crypto.getRandomValues(bytes)
    return bytes
  } else {
    // TODO: avoid require warning
    const { randomBytes } = require("crypto")
    return Uint8Array.from(randomBytes(length))
  }
}
