import { expect, test, vi } from "vitest"
import { CardanoWeb3 } from "../src"

test("utils/mnemonicGenerate", async () => {
  const web3 = await CardanoWeb3.init()
  const mnemonic = web3.utils.keys.mnemonicGenerate(24)
  expect(mnemonic.split(" ")).toHaveLength(24)
})

test("account/fromMnemonic", async () => {
  const web3 = await CardanoWeb3.init()
  const mnemonic = web3.utils.keys.mnemonicGenerate()
  const account = web3.account.fromMnemonic(mnemonic)
  expect(account.__config.xpubKey).toHaveLength(114)
})

test("provider/protocolParameters", async () => {
  const web3 = await CardanoWeb3.init()
  const protocolParameters = await web3.provider.getProtocolParameters()
  expect(protocolParameters).toHaveProperty("minFeeA")
})

test("explorer/koios/tip", async () => {
  const web3 = await CardanoWeb3.init()
  const tip = await web3.explorer.koios.GET("/tip")
  expect(tip.data?.[0]).toHaveProperty("epoch_no")
})

test("explorer/nftcdn/metadata", async () => {
  const web3 = await CardanoWeb3.init()
  const metadata = await web3.explorer.nftcdn.GET("/metadata/{fingerprint}", {
    params: {
      path: {
        fingerprint: "asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx",
      },
    },
  })
  expect(metadata.data).toHaveProperty("fingerprint")
})

test("explorer/price/orders", async () => {
  const web3 = await CardanoWeb3.init()
  const orders = await web3.explorer.price.GET("/orders")
  expect(orders.data?.[0]).toHaveProperty("asset_a")
})