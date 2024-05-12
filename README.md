<a href="https://discord.gg/WhZmm46APN"><img alt="Discord" src="https://img.shields.io/discord/852538978946383893?style=for-the-badge&logo=discord&label=Discord&labelColor=%231940ED&color=%233FCB9B"></a>
<a href="https://www.npmjs.com/package/cardano-web3-js"><img alt="NPM" src="https://img.shields.io/npm/v/cardano-web3-js/latest?style=for-the-badge&logo=npm&labelColor=%231940ED&color=%233FCB9B">
<a href="https://github.com/ray-network/cardano-web3-js/actions"><img alt="CODEQL" src="https://img.shields.io/github/actions/workflow/status/xray-network/cardano-web3-js/codeql.yml?label=CodeQL&logo=github&style=for-the-badge&labelColor=%231940ED&color=%233FCB9B"></a>

  
# 🛠 Cardano Web3 JavaScript SDK

> [!WARNING]
> CardanoWeb3js is in active development: createTx() will be added soon. Stay tuned to https://twitter.com/xray_network for updates

> [!NOTE]
> CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain. It supports both Node.js and browser environments, streamlining transaction creation, smart contract deployment, and data exploration. Ideal for developers, this toolkit simplifies Cardano cryptographic operations and API interactions

## Installation

To install with Yarn, run:

```TypeScript
yarn install cardano-web3-js
```

To install with NPM, run:

```TypeScript
npm i cardano-web3-js
```

## Basic Usage
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const mnemonic = web3.utils.keys.mnemonicGenerate()
  const account = web3.account.fromMnemonic(mnemonic)

  await account.fetchAndUpdateState() // update balance & delegation info

  console.log(account.__config) // account info (xpub, changeAddress, creds, etc)
  console.log(account.__state) // balance & delegation info

  const tx = web3.createTx() // TODO: will be available soon
}

app()
```

## Web3 Configuration Parameteres

<details>
  <summary>Configuration Parameters</summary>
  
``` ts
import { CardanoWeb3, KoiosProvider, KupmiosProvider, BlockfrostProvider } from "cardano-web3-js"

const app = async () => {
  const providerHeaders = {
    "x-api-key": "YOUR_API_KEY_01",
  }

  const koiosHeaders = {
    "x-api-key": "YOUR_API_KEY_02",
  }

  const web3 = await CardanoWeb3.init({
    network: "preprod", // "mainnet" | "preprod" | "preview" | "custom"
    ttl: 900, // 900 secs = 15 minutes
    remoteTxEvaluate: true, // evaluate validator cost remotely on tx.build()
    remoteProtocolParams: true, // get protocol parameters remotely on createTx()
    provider: new KoiosProvider("https://api.koios.rest/api/v1", providerHeaders),
    explorer: {
      koios: {
        headers: koiosHeaders,
        url: "https://preprod.koios.rest/api/v1",
      },
      nftcdn: {
        headers: {},
        url: "https://graph.xray.app/output/nftcdn/preprod/api/v1",
      },
      pricing: {
        headers: {},
        url: "https://graph.xray.app/output/procing/mainnet/api/v1", // only mainnet available
      },
    }
  })

  const { data, error } = await web3.explorer.koios.GET("/tip")
  console.log(data?.[0].epoch_no) // current epoch number

  console.log(web3.network) // configured network
  console.log(web3.remoteProtocolParams) // configured remoteProtocolParams
  console.log(web3.remoteTxEvaluate) // configured remoteTxEvaluate
  console.log(web3.ttl) // configured ttl
}

app()
```
</details>

## Create Account

<details>
  <summary>Create account with derivation path from Mnemonic</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  const mnemonic = web3.utils.keys.mnemonicGenerate() // generate mnemonic
  const account = web3.account.fromMnemonic(mnemonic, [1852, 1815, 1]) // create account #1 from mnemonic
}

app()
```
</details>

<details>
  <summary>Create account from Connector (Browser Extension)</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  const wallets = await web3.connector.list() // list of available wallets
  const connector = await web3.connector.init("eternl") // enable eternl wallet
  const account = await web3.account.fromConnector(connector) // create account from connected wallet
}

app()
```
</details>

<details>
  <summary>Create account from XPRV private key</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  const xprvKey = web3.utils.keys.xprvKeyGenerate() // generate XPRV key
  const account = web3.account.fromXprvKey(xprvKey) // account from XPRV key

  const account2 = web3.account.fromXpubKey("xprv...") // create account2 direct from XPRV key
}

app()
```
</details>

<details>
  <summary>Create account from XPUB public key</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  const xprvKey = web3.utils.keys.xprvKeyGenerate() // generate XPRV key
  const xpubKey = web3.utils.keys.xpubKeyFromXprvKey(xprvKey) // XPRV key to XPUB key
  const account = web3.account.fromXpubKey(xpubKey) // create account from XPUB key

  const account2 = web3.account.fromXpubKey("xpub...") // create account2 direct from XPUB key
}

app()
```
</details>

<details>
  <summary>Create account from XVK public key</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  const account = web3.account.fromXvkKey("xvk....") // create account direct from XVK key
}

app()
```
</details>

## Create, Sign and Submit TX

<details>
  <summary>Create TX * soon</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  // TODO
}

app()
```
</details>

<details>
  <summary>Create TX from Account (Auto Build) * soon</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  // TODO
}

app()
```
</details>

## Provider API

<details>
  <summary>Provider Methods</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const datum = await web3.provider.getDatumByHash("hash...") // get datum by hash
  const script = await web3.provider.getScriptByHash("script...") // 
  const delegation = await web3.provider.getDelegation("stake1...") // get delegation by stake address
  const utxos = await web3.provider.getUtxosByPaymentCred("paymentcred...") // get utxos by payment cred
  const hash = await web3.provider.submitTx("cbor...") // submit tx to blockchain
  const protocolParameters = await web3.provider.getProtocolParameters() // get protocol parameters
  await web3.provider.observeTx("txhash...", 1_000, 60_000) // check tx is in presented in blockchain every 1s, max 60s
    .then((status: boolean) => {
      console.log(status)
    })
}

app()
```
</details>

## Explorer APIs (Typed Clients)

<details>
  <summary>Koios, Nftcdn, Price APIs Usage & Query Params</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  // Koios API
  const latest10Blocks = await web3.explorer.koios.GET("/blocks", {
    params: {
      query: {
        limit: 10,
        offset: 0,
      }
    }
  })
  console.log(latest10Blocks.data)

  // Nftcdn API
  const assetMetadata = await web3.explorer.nftcdn.GET("/metadata/{fingerprint}", {
    params: {
      path: {
        fingerprint: "asset1zwa4chw9xm7xwk7g46ef94qsj28hmnd7qffhgx",
      },
    },
  })
  console.log(assetMetadata.data)

  // Price API
  const dexsOrders = await web3.explorer.price.GET("/orders")
  console.log(dexsOrders.data)
}

app()
```
</details>

## Utils

<details>
  <summary>Examples of some utilities</summary>
  
``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const mnemonic = web3.utils.keys.mnemonicGenerate() // generate 24-word (default) mnemonic
  const mnemonic12 = web3.utils.keys.mnemonicGenerate(12) // generate 12-word mnemonic
  const mnemonic15 = web3.utils.keys.mnemonicGenerate(15) // generate 15-word mnemonic
  const mnemonic24 = web3.utils.keys.mnemonicGenerate(24) // generate 24-word mnemonic
  const isMnemonicValid = web3.utils.keys.mnemonicValidate(mnemonic) // is valid

  const xprvKey = web3.utils.keys.xprvKeyGenerate() // generate XPRV key
  const isXprvValid = web3.utils.keys.xprvKeyValidate(mnemonic) // is valid

  const xpubKey = web3.utils.keys.xpubKeyFromXprvKey(xprvKey) // XPUB key from XPRV key
  const isXpubValid = web3.utils.keys.xpubKeyValidate(xpubKey) // is valid

  const address_0_1 = web3.utils.address.deriveBase(xpubKey, [0, 1]) // derive base address from XPUB key

  const { changeAddress, paymentCred, stakingCred, stakingAddress } = web3.utils.account.getDetailsFromXpub(xpubKey) // account base info

  // etc
}

app()
```
</details>

## Test

Check [test/index.spec.ts](test/index.spec.ts) for available test

```TypeScript
yarn test
```
