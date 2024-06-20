import { expect, it, describe } from "vitest"
import { CardanoWeb3, T } from "../src"
import { testData } from "./__config"

describe("Account", async () => {
  const web3 = await CardanoWeb3.init()

  it("FromMnemonic", async () => {
    const mnemonicGenerated = web3.utils.keys.mnemonicGenerate()
    const account = web3.account.fromMnemonic(mnemonicGenerated)
    expect(account.__config.xpubKey).toHaveLength(114)
  })

  it("FromXprvKey", async () => {
    const xprvKeyGenerated = web3.utils.keys.xprvKeyGenerate()
    const account = web3.account.fromXprvKey(xprvKeyGenerated)
    expect(account.__config.xpubKey).toHaveLength(114)
  })

  it("FromXpubKey", async () => {
    const account = web3.account.fromXpubKey(testData.xpubKey)
    expect(account.__config.xpubKey).toHaveLength(114)
  })

  it("EncodeXprvKey", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    account.encodeAndUpdateXprvKey("password123")
    expect(account.__config.xprvKey).length(450)
  })
})
