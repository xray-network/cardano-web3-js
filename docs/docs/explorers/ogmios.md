# Ogmios

Ogmios is a Cardano node interface that provides a RESTful API for interacting with the Cardano blockchain. It is designed to be lightweight and efficient, making it suitable for various applications, including wallets, dApps, and other blockchain-related services.

:::info
XRAY/Network manages a standalone Ogmios cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app).  Or instantiate your own Ogmios instance.
:::

### Tips

* Client repository: https://github.com/xray-network/cardano-ogmios-client
* Playground & API docs: https://ogmios.dev/
* You can configure API url and headers when [initializing](/docs/initialization) CW3js

## Usage examples

```ts
import { CardanoWeb3, OgmiosTypes } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const health = (await web3.explorers.ogmios.GET("/health")).data
console.log(health)

// etc...
```

## Direct API Access

```
https://graph.xray.app/output/ogmios/mainnet/api/v1/health
```