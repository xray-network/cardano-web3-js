import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "../src"
import { testData } from "./__test"

describe("Message", async () => {
  const web3 = new CardanoWeb3({
    network: "preview",
  })

  it("SignAndVerify: with Account", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    const message = "Hello, World!"
    const signature = await web3.message.signWithAccount(account, message)
    const verified = web3.message.verify(account.__config.paymentAddress, message, signature)
    expect(verified).toBe(true)
  })

  it("SignAndVerify: with XprvKey", async () => {
    const message = "Hello, World!"
    const verificationKey = web3.utils.keys.xprvToVrfKey(testData.xprvKey, testData.accountPath, testData.addressPath)
    const signature = web3.message.signWithVrfKey(verificationKey, testData.paymentAddress, message)
    const verified = web3.message.verify(testData.paymentAddress, message, signature)
    expect(verified).toBe(true)
  })
})
