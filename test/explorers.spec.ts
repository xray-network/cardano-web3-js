import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "@"

describe("Explorer", async () => {
  describe("Mainnet", async () => {
    const web3 = new CardanoWeb3()

    it("Koios: /tip", async () => {
      const tip = await web3.explorers.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Ogmios: /health", async () => {
      const health = await web3.explorers.ogmios.GET("/health")
      expect(health.data).toHaveProperty("currentEpoch")
    })

    // it("Kupo: /health", async () => {
    //   const health = await web3.explorers.kupo.GET("/health", {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: "Bearer YOUR_API_KEY", // XRAY/Graph API key
    //     },
    //   })
    //   console.log(health.data)
    //   expect(health.data).toHaveProperty("most_recent_node_tip")
    // })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorers.nftcdn.GET("/metadata/{id}", {
        params: {
          path: {
            id: "86abe45be4d8fb2e8f28e8047d17d0ba5592f2a6c8c452fc88c2c14358524159",
          },
        },
      })
      expect(metadata.data).toHaveProperty("fingerprint")
    })
  })

  describe("Preprod", async () => {
    const web3 = new CardanoWeb3({ network: "preprod" })

    it("Koios: /tip", async () => {
      const tip = await web3.explorers.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Ogmios: /health", async () => {
      const health = await web3.explorers.ogmios.GET("/health")
      expect(health.data).toHaveProperty("currentEpoch")
    })

    // it("Kupo: /health", async () => {
    //   const health = await web3.explorers.kupo.GET("/health", {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: "Bearer YOUR_API_KEY", // XRAY/Graph API key
    //     },
    //   })
    //   expect(health.data).toHaveProperty("most_recent_node_tip")
    // })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorers.nftcdn.GET("/metadata/{id}", {
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
    const web3 = new CardanoWeb3({ network: "preview" })

    it("Koios: /tip", async () => {
      const tip = await web3.explorers.koios.GET("/tip")
      expect(tip.data?.[0]).toHaveProperty("epoch_no")
    })

    it("Ogmios: /health", async () => {
      const health = await web3.explorers.ogmios.GET("/health")
      expect(health.data).toHaveProperty("currentEpoch")
    })

    // it("Kupo: /health", async () => {
    //   const health = await web3.explorers.kupo.GET("/health", {
    //     headers: {
    //       Accept: "application/json",
    //       Authorization: "Bearer YOUR_API_KEY", // XRAY/Graph API key
    //     },
    //   })
    //   expect(health.data).toHaveProperty("most_recent_node_tip")
    // })

    it("Nftcdn: /metadata", async () => {
      const metadata = await web3.explorers.nftcdn.GET("/metadata/{id}", {
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
