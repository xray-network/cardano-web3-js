import { expect, it, describe } from "vitest"
import { CardanoWeb3, Account } from "../src"
import { testData } from "./__test"

describe("DEVELOPMENT", async () => {
  const web3 = await CardanoWeb3.init()


  it("DEV", async () => {
    const mnemonicGenerated = web3.utils.keys.mnemonicGenerate()
    const account = web3.account.fromMnemonic(mnemonicGenerated)
    console.log("account", account)
    expect(account.__config.xpubKey).exist
  })
})
