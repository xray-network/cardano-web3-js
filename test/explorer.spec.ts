import { expect, it, describe } from "vitest"
import { CardanoWeb3, T } from "../src"

describe("Explorer", async () => {
  describe("Mainnet", async () => {
    const web3 = await CardanoWeb3.init()

    it("Koios: /tip", async () => {
      const tip = await web3.explorer.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{fingerprint}", {
        params: {
          path: {
            fingerprint: "asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })

    it("Pricing: /orders", async () => {
      const orders = await web3.explorer.pricing.GET("/orders")
      expect(orders.data?.[0]).toHaveProperty("asset_a")
    })
  })

  describe("Preprod", async () => {
    const web3 = await CardanoWeb3.init({ network: "preprod" })

    it("Koios: /tip", async () => {
      const tip = await web3.explorer.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{fingerprint}", {
        params: {
          path: {
            fingerprint: "asset1azw6h7l3zmwrpmuhuny0u3k70hk3qxyjkcq4du",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })
  })

  describe("Preview", async () => {
    const web3 = await CardanoWeb3.init({ network: "preview" })

    it("Koios: /tip", async () => {
      const tip = await web3.explorer.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{fingerprint}", {
        params: {
          path: {
            fingerprint: "asset1up032cdhr8e6xj63uqgys3pcygj0sr9l7wludw",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })
  })
})
