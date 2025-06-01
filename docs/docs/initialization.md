# Initialization

Here you can find how to initialize the CardanoWeb3 library with different parameters and providers.


## Default

CardanoWeb3 is initialized with Koios mainnet provider by default. You can change the network and other parameters as needed.

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

console.log(web3.__config) // Access CardanoWeb3 configuration
```

## Change network

You can change the network by passing the `network` parameter to the `CardanoWeb3` constructor.

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({ network: "preview" }) // Koios preview network provider
```

## Custom params

You can override the default protocol parameters and TTL by passing them to the `CardanoWeb3` constructor.

```ts
import { CardanoWeb3, KupmiosProvider } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  network: "mainnet", // "mainnet" | "preprod" | "preview" | "custom"
  protocolParams: {}, // override protocolParams, eg. in case of custom network
  ttl: 900, // 900 secs = 15 minutes
  provider: new KupmiosProvider({
    ogmiosUrl: "https://ogmios.com/api",
    kupoUrl: "https://kupo.com/api",
    ogmiosHeaders: {}, // pass custom headers
    kupoHeaders: {}, // pass custom headers
  }),
  explorer: {
    koios: {
      headers: {}, // pass custom headers
      url: "https://api.koios.rest/api/v1",
    },
    nftcdn: {
      headers: {}, // pass custom headers
      url: "https://graph.xray.app/output/nftcdn/mainnet/api/v1",
    },
    pricing: {
      headers: {}, // pass custom headers
      url: "https://graph.xray.app/output/pricing/mainnet/api/v1", // only mainnet available
    },
  }
})
```