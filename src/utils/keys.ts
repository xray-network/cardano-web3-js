import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import * as Bech32 from "bech32"
import * as Bip39 from "bip39"
import { fromHex, harden } from "./misc"
import * as CW3Types from "@/types"

export const mnemonicGenerate = (length: 12 | 15 | 24 = 24): string => {
  return Bip39.generateMnemonic((32 * length) / 3)
}

export const mnemonicValidate = (mnemonic: string): boolean => {
  return Bip39.validateMnemonic(mnemonic)
}

export const mnemonicToXprvKey = (mnemonic: string, password?: string): string => {
  return CML.Bip32PrivateKey.from_bip39_entropy(
    fromHex(Bip39.mnemonicToEntropy(mnemonic)),
    password ? new TextEncoder().encode(password) : new Uint8Array()
  ).to_bech32()
}

export const xprvKeyGenerate = (): string => {
  return CML.Bip32PrivateKey.generate_ed25519_bip32().to_bech32()
}

export const xprvKeyValidate = (xprvKey: string): boolean => {
  try {
    CML.Bip32PrivateKey.from_bech32(xprvKey).to_bech32()
    return true
  } catch {
    return false
  }
}

export const xprvKeyToXpubKey = (
  xprvKey: string,
  accountPath?: CW3Types.AccountDerivationPath,
  addressPath?: CW3Types.AddressDerivationPath
): string => {
  let key = CML.Bip32PrivateKey.from_bech32(xprvKey)
  if (accountPath) {
    for (const index of accountPath) {
      key = key.derive(harden(index))
    }
  }
  if (addressPath) {
    for (const index of addressPath) {
      key = key.derive(index)
    }
  }
  return key.to_public().to_bech32()
}

export const xprvToVrfKey = (
  xprvKey: string,
  accountPath?: CW3Types.AccountDerivationPath,
  addressPath?: CW3Types.AddressDerivationPath
): string => {
  let key = CML.Bip32PrivateKey.from_bech32(xprvKey)
  if (accountPath) {
    for (const index of accountPath) {
      key = key.derive(harden(index))
    }
  }
  if (addressPath) {
    for (const index of addressPath) {
      key = key.derive(index)
    }
  }
  return key.to_raw_key().to_bech32()
}

export const xvkKeyToXpubKey = (xvkKey: string): string => {
  return Bech32.bech32.encode("xpub", Bech32.bech32.decode(xvkKey, 118).words, 114)
}

export const xpubKeyValidate = (pubKey: string): boolean => {
  try {
    CML.Bip32PublicKey.from_bech32(pubKey)
    return true
  } catch {
    return false
  }
}
