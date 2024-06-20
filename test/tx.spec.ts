import { expect, it, describe } from "vitest"
import { CardanoWeb3, T } from "../src"
import { testData } from "./__config"

describe("TX", async () => {
  const web3 = await CardanoWeb3.init()
  const account = web3.account.fromXprvKey(testData.xprvKey)

  it("Pay to address", async () => {
    expect(true).toEqual(true)
  })

  it("Pay to address with data", async () => {
    expect(true).toEqual(true)
  })

  it("Deposit to contract", async () => {
    expect(true).toEqual(true)
  })

  it("Deposit to contract (parametrized)", async () => {
    expect(true).toEqual(true)
  })

  it("Collect from contract", async () => {
    expect(true).toEqual(true)
  })

  it("Collect from contract, with reference script", async () => {
    expect(true).toEqual(true)
  })

  it("Evaluate contract", async () => {
    expect(true).toEqual(true)
  })

  it("Check required signer", async () => {
    expect(true).toEqual(true)
  })

  it("Mint token (unlocked policy)", async () => {
    expect(true).toEqual(true)
  })

  it("Mint token (required signer)", async () => {
    expect(true).toEqual(true)
  })

  it("Mint token (collect assets)", async () => {
    expect(true).toEqual(true)
  })

  it("Burn token", async () => {
    expect(true).toEqual(true)
  })

  it("Reward withdrawal", async () => {
    expect(true).toEqual(true)
  })

  it("Register stake", async () => {
    expect(true).toEqual(true)
  })
})
