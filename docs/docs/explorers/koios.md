# Koios

Koios is a distributed & open-source public API query layer for Cardano, that is elastic in nature and addresses ever-demanding requirements from Cardano Blockchain.

:::info
XRAY/Network manages a standalone Koios cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app).
:::

### Tips

* Playground & API docs: https://api.koios.rest/
* You can configure API url and headers when [initializing](/docs/cardano-web3/initialization) CW3js.

## Usage examples

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const accountList = await web3.explorer.koios.GET("/account_list")
console.log(accountList)

const accountListWithOffsetAndLimit = await web3.explorer.koios.GET("/account_list&offset=1000&limit=500")
console.log(accountListWithOffsetAndLimit)

const accountInfo = await web3.explorer.koios.POST("/account_info", {
  body: {
    _stake_addresses: ["stake..."]
  }
})
console.log(accountInfo)

// etc...
```

## Direct API Access

```
https://graph.xray.app/output/koios/mainnet/api/v1/tip
```