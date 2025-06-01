# Providers

## Koios

Koios is a distributed & open-source public API query layer for Cardano, that is elastic in nature and addresses ever-demanding requirements from Cardano Blockchain.

:::info
XRAY/Network manages a standalone Koios cluster, which is the default data provider (and explorer) for CW3js. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs or original [Koios](https://koios.rest/), or recharge [XRAY/Graph](https://xray.app).
:::

### Usage examples

```ts title="Get network tip"
import { CardanoWeb3, KoiosProvider } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KoiosProvider(
    "https://api.koios.rest/api/v1",
    {}, // pass custom haeders if needed
  )
})

const tip = await web3.provider.getTip()
console.log(tip)
```
```ts title="UTXOs by address"
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KoiosProvider(
    "https://api.koios.rest/api/v1",
    {}, // pass custom haeders if needed
  )
})

const utxos = await web3.provider.getUtxosByAddress("addr1...")
console.log(utxos)
```
```ts title="Get datum and script by hash"
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KoiosProvider(
    "https://api.koios.rest/api/v1",
    {}, // pass custom haeders if needed
  )
})

const datum = await web3.provider.getDatumByHash("hash...")
const script = await web3.provider.getScriptByHash("hash...")
console.log(datum)
console.log(script)
```

## Kupmios (Kupo & Ogmios)

Kupo is a fast, lightweight and customizable chain index for Cardano, and Ogmios is a JSON/RPC bridge for Cardano. These tools allow you to retrieve data from the chain and monitor the state of the chain.

:::info
XRAY/Network manages a standalone Ogmios and Kupo (with the match all parameter) cluster. Unauthenticated uses a basic tariff with limits on requests from Origin and IP addresses, so be aware that if the load on your application grows, you should switch to paid tariffs and recharge [XRAY/Graph](https://xray.app).
:::

### Usage examples

```ts title="Get network tip"
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KupmiosProvider({
    ogmiosUrl: "https://ogmios.com/api",
    kupoUrl: "https://kupo.com/api",
    ogmiosHeaders: {}, // pass custom headers
    kupoHeaders: {}, // pass custom headers
  }),
})

const tip = await web3.provider.getTip()
console.log(tip)
```
```ts title="UTXOs by address"
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KupmiosProvider({
    ogmiosUrl: "https://ogmios.com/api",
    kupoUrl: "https://kupo.com/api",
    ogmiosHeaders: {}, // pass custom headers
    kupoHeaders: {}, // pass custom headers
  }),
})

const utxos = await web3.provider.getUtxosByAddress("addr1...")
console.log(utxos)
```
```ts title="Get datum and script by hash"
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3({
  provider: new KupmiosProvider({
    ogmiosUrl: "https://ogmios.com/api",
    kupoUrl: "https://kupo.com/api",
    ogmiosHeaders: {}, // pass custom headers
    kupoHeaders: {}, // pass custom headers
  }),
})

const datum = await web3.provider.getDatumByHash("hash...")
const script = await web3.provider.getScriptByHash("hash...")
console.log(datum)
console.log(script)
```

## Mastering Custom Provider

Provider interface must implements [Provider](/api/cardano-web3-js/namespaces/CW3Types/type-aliases/Provider) type

```ts
import { CW3Types } from "cardano-web3-js"


const NewProvider = (): CW3Types.Provider => {
  return {
    ...
  }
}
```