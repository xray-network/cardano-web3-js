import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "../src"
import { testData } from "./__test"

describe("Message", async () => {
  const web3 = await CardanoWeb3.init({
    network: "preview",
  })

  it("SignAndVerify: with Account", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    const message = "Hello, World!"
    const signature = await web3.signMessageWithAccount(account, message)
    const verified = web3.verifyMessage(account.__config.paymentAddress, message, signature)
    expect(verified).toBe(true)
  })

  it("SignAndVerify: with Account (encoded)", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    const message = "Hello, World!"
    account.encodeAndUpdateXprvKey("password123")
    const signature = await web3.signMessageWithAccount(account, message, "password123")
    const verified = web3.verifyMessage(account.__config.paymentAddress, message, signature)
    expect(verified).toBe(true)
  })

  it("SignAndVerify: with XprvKey", async () => {
    const message = "Hello, World!"
    const verificationKey = web3.utils.keys.xprvToVrfKey(testData.xprvKey, testData.accountPath, testData.addressPath)
    const signature = web3.signMessageWithVrfKey(verificationKey, testData.paymentAddress, message)
    const verified = web3.verifyMessage(testData.paymentAddress, message, signature)
    expect(verified).toBe(true)
  })
})
