import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import * as CW3Types from "@/types"

export const unixTimeToSlot = (unixTime: number, slotConfig: CW3Types.SlotConfig): number => {
  const timePassed = unixTime - slotConfig.zeroTime
  const slotsPassed = Math.floor(timePassed / slotConfig.slotDuration)
  return slotsPassed + slotConfig.zeroSlot
}

export const slotToUnixTime = (slot: number, slotConfig: CW3Types.SlotConfig): number => {
  const msAfterBegin = (slot - slotConfig.zeroSlot) * slotConfig.slotDuration
  return slotConfig.zeroTime + msAfterBegin
}
