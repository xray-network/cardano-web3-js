# Kupo

Kupo is a Cardano blockchain indexer and API provider that offers a wide range of endpoints for querying blockchain data. It is designed to be fast, reliable, and easy to use, making it suitable for developers building applications on the Cardano platform.

:::info
XRAY/Network manages a standalone Kupo cluster. Only paid users can access it, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app). Or instantiate your own Kupo instance.
:::

### Tips

* Client repository: https://github.com/xray-network/cardano-kupo-client
* Playground & API docs: https://cardanosolutions.github.io/kupo/
* You can configure API url and headers when [initializing](/docs/initialization) CW3js

## Usage examples

```ts
import { CardanoWeb3, KupoTypes } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  explorer: {
    "kupo": {
      url: "https://graph.xray.app/output/services/kupo/mainnet/api/v1",
      headers: {
        Authorization: `Bearer ${process.env.KUPO_API_KEY}`,
      }
    }
  }
})

console.log((await web3.explorers.kupo.GET("/health")).data)

// etc...
```

## Direct API Access (needs authentication)

```
https://graph.xray.app/output/services/kupo/mainnet/api/v1/health
```