import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import cip4 from "./libs/cip4"
import { getFingerprint, assetNameToAssetNameAscii } from "./asset"
import { deriveBase, getCredentials, getStakingAddress } from "./address"
import * as CW3Types from "@/types"

export const checksum = (
  xpubKey: string
): {
  checksumId: string
  checksumImage: string
} => {
  return cip4(xpubKey)
}

export const getDetailsFromXpub = (
  xpubKey: string,
  addressDerivationPath: CW3Types.AddressDerivationPath,
  netoworkId: CW3Types.NetworkId
): {
  paymentAddress: string
  paymentCred: string
  stakingAddress: string
  stakingCred: string
} => {
  const paymentAddress = deriveBase(xpubKey, addressDerivationPath, netoworkId)
  const { paymentCred, stakingCred } = getCredentials(paymentAddress)
  const stakingAddress = getStakingAddress(paymentAddress)

  return {
    paymentAddress,
    paymentCred: paymentCred.hash,
    stakingAddress,
    stakingCred: stakingCred.hash,
  }
}

export const getBalanceFromUtxos = (utxos: CW3Types.Utxo[]): CW3Types.Balance => {
  const balance: CW3Types.Balance = {
    value: BigInt(0),
    assets: [],
  }

  utxos.forEach((utxo) => {
    balance.value += utxo.value
    utxo.assets.forEach((asset) => {
      const existingAsset = balance.assets.find((a) => a.policyId + a.assetName === asset.policyId + asset.assetName)
      if (existingAsset) {
        existingAsset.quantity += asset.quantity
      } else {
        balance.assets.push({
          ...asset,
          fingerprint: getFingerprint(asset.policyId, asset.assetName),
          assetNameAscii: assetNameToAssetNameAscii(asset.assetName),
        })
      }
    })
  })

  return balance
}
