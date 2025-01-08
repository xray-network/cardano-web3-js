import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "../src"

describe("Explorer", async () => {
  describe("Mainnet", async () => {
    const web3 = await CardanoWeb3.init()

    it("Koios: /tip", async () => {
      const tip = await web3.explorer.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{id}", {
        params: {
          path: {
            id: "86abe45be4d8fb2e8f28e8047d17d0ba5592f2a6c8c452fc88c2c14358524159",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })

    // TODO: Not available yet
    // it("Pricing: /orders", async () => {
    //   const orders = await web3.explorer.pricing.GET("/orders")
    //   expect(orders.data?.[0]).toHaveProperty("asset_a")
    // })
  })

  describe("Preprod", async () => {
    const web3 = await CardanoWeb3.init({ network: "preprod" })

    it("Koios: /tip", async () => {
      const tip = await web3.explorer.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{id}", {
        params: {
          path: {
            id: "0052bf6cd66b13b469813422373d8362918aef39a2607af9fa87871957415350",
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
      const metadata = await web3.explorer.nftcdn.GET("/metadata/{id}", {
        params: {
          path: {
            id: "7c833f1eb9b70c2e700d028e0ee28d421edad2af4222061be525382d4144415f555344435f4c50",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })
  })
})
