# XRAY/Graph Pricing

Cardano Tokens Price indexer (of popular DEXes).

:::info
Pricing API is under active development, currently only one endpoint "/orders" is available. If you see this label, it means that development is still in progress.
:::

:::info
XRAY/Network manages a standalone Pricing cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app).
:::

### Tips

* You can configure API url and headers when [initializing](/docs/cardano-web3/initialization) CW3js.

## Usage examples

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const orders = await web3.explorer.pricing.GET("/orders")
console.log(orders)
```

## Direct API Access

```
https://graph.xray.app/output/pricing/mainnet/api/v1/orders
```