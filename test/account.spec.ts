import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "../src"
import { testData } from "./__test"

describe("Account", async () => {
  const web3 = new CardanoWeb3()

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

  it("FromXprvKeyEncoded", async () => {
    const xprvKeyGenerated = web3.utils.keys.xprvKeyGenerate()
    const account = web3.account.fromXprvKey(xprvKeyGenerated, "123456")
    const encodedXprvKey = account.__config.xprvKey
    const decodedXprvKey = account.getDecodedXprvKey("123456")
    expect(xprvKeyGenerated).toBe(decodedXprvKey)
  })

  it("FromXpubKey", async () => {
    const account = web3.account.fromXpubKey(testData.xpubKey)
    expect(account.__config.xpubKey).toHaveLength(114)
  })

  it("EncodeXprvKey", async () => {
    const account = web3.account.fromXprvKey(testData.xprvKey)
    const encodedXprvKey = account.getEncodedXprvKey("password123")
    expect(encodedXprvKey).length(450)
  })
})
