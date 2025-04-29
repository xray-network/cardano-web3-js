import { expect, it, describe } from "vitest"
import { CardanoWeb3 } from "../src"

describe("Provider", async () => {
  const web3 = new CardanoWeb3()

  it("getTip()", async () => {
    const tip = await web3.provider.getTip()
    expect(tip).toHaveProperty("absSlot")
  })

  it("getProtocolParameters()", async () => {
    const protocolParameters = await web3.provider.getProtocolParameters()
    expect(protocolParameters).toHaveProperty("minFeeA")
  })

  it("getUtxosByAddresses()", async () => {
    const utxos = await web3.provider.getUtxosByAddresses([
      "addr1qy2jt0qpqz2z2z9zx5w4xemekkce7yderz53kjue53lpqv90lkfa9sgrfjuz6uvt4uqtrqhl2kj0a9lnr9ndzutx32gqleeckv",
      "addr1q9xvgr4ehvu5k5tmaly7ugpnvekpqvnxj8xy50pa7kyetlnhel389pa4rnq6fmkzwsaynmw0mnldhlmchn2sfd589fgsz9dd0y",
    ])
    expect(utxos).instanceOf(Array)
  })

  it("getUtxosByAddress()", async () => {
    const utxos = await web3.provider.getUtxosByAddress(
      "addr1qy2jt0qpqz2z2z9zx5w4xemekkce7yderz53kjue53lpqv90lkfa9sgrfjuz6uvt4uqtrqhl2kj0a9lnr9ndzutx32gqleeckv"
    )
    expect(utxos).instanceOf(Array)
  })

  it("getDatumByHash()", async () => {
    const datumHex = "582b57656c636f6d6520746f20416c6f6e7a6f2045726121202d20466976652042696e6172696573207465616d"
    const datum = await web3.provider.getDatumByHash("818ee3db3bbbd04f9f2ce21778cac3ac605802a4fcb00c8b3a58ee2dafc17d46")
    expect(datum).toEqual(datumHex)
  })

  it("getScriptByHash()", async () => {
    const script = await web3.provider.getScriptByHash("bd2119ee2bfb8c8d7c427e8af3c35d537534281e09e23013bca5b138")
    expect(script).toHaveProperty("script")
  })
})
