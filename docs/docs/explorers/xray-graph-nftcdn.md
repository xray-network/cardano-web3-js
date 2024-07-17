# XRAY/Graph NFTCDN

Metadata/Datums indexer & Image Server with IPFS gateway.

:::info
XRAY/Network manages a standalone NFTCDN cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app).
:::

### Tips

* You can configure API url and headers when [initializing](/docs/cardano-web3/initialization) CW3js.

## Usage examples

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const metadata = await client.GET("/metadata/{fingerprint}", {
  params: {
    path: {
      fingerprint: "asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx",
    },
  },
})
console.log(metadata)
```

## Direct Image Access (by Fingerprint)

```
https://graph.xray.app/output/nftcdn/mainnet/api/v1/image/asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx
```

## Direct Metadata Access (by Fingerprint)

```
https://graph.xray.app/output/nftcdn/mainnet/api/v1/metadata/asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx
```