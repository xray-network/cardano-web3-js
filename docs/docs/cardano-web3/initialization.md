# Initialization

Here we will describe the basic initialization method of CardanoWeb3 class, for detailed information see [API](/api/classes/CardanoWeb3) section 


## Default

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
```

## Change network

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init({ network: "preview" }) // Koios preview network provider
```

## Custom params

```ts
import { CardanoWeb3, KupmiosProvider } from "cardano-web3-js"

const web3 = await CardanoWeb3.init({
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

## Accessing types

```ts
import type { T, Account, Connector, Data, Constr } from "cardano-web3-js"

const NewProvider = (): T.Provider => {
  return {
    ...
  }
}
```