# XRAY/Graph NFTCDN

Metadata/Datums indexer & Image Server with IPFS gateway.

:::info
XRAY/Network manages a standalone NFTCDN cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app). Or instantiate your own NFTCDN instance.
:::

### Tips

* Client repository: https://github.com/xray-network/cardano-nftcdn-client
* You can configure API url and headers when [initializing](/docs/initialization) CW3js

## Usage examples

```ts
import { CardanoWeb3, NftcdnTypes } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const metadata = await web3.explorers.nftcdn.GET("/metadata/{fingerprint}", {
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
https://graph.xray.app/output/services/nftcdn/mainnet/api/v1/image/asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx
```

## Direct Metadata Access (by Fingerprint)

```
https://graph.xray.app/output/services/nftcdn/mainnet/api/v1/metadata/asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx
```