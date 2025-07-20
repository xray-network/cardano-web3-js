# Initialization

Here you can find how to initialize the CardanoWeb3 library with different parameters and providers.


## Versions

There are several versions of CardanoWeb3 that you can use:
:::tabs
== Default
```ts
import { CardanoWeb3 } from "cardano-web3-js"
```
<small>This is the default import for CardanoWeb3, which is suitable for most environments. Selected automatically based on your environment (Node.js, browser, or web serverless), if your bundler supports it.</small>

== NodeJS
```ts
import { CardanoWeb3 } from "cardano-web3-js/nodejs"
```
<small>This version is optimized for Node.js environments, providing access to Node.js-specific features and libraries.</small>
== Browser (Bundlers)
```ts
import { CardanoWeb3 } from "cardano-web3-js/browser"
```
<small>This version is optimized for browser environments, allowing you to use CardanoWeb3 in web applications.</small>

== Web & Serverless
```ts
import { CardanoWeb3 } from "cardano-web3-js/web"
```
<small>This version is optimized for serverless environments, such as Cloudflare Workers, where you might not have access to Node.js-specific features.</small>

:::

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
      url: "https://graph.xray.app/output/services/nftcdn/mainnet/api/v1",
    },
    pricing: {
      headers: {}, // pass custom headers
      url: "https://graph.xray.app/output/services/pricing/mainnet/api/v1", // only mainnet available
    },
  }
})
```