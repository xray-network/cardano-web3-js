<a href="https://discord.gg/WhZmm46APN"><img alt="Discord" src="https://img.shields.io/discord/852538978946383893?style=for-the-badge&logo=discord&label=Discord&labelColor=%231940ED&color=%233FCB9B"></a>
<a href="https://www.npmjs.com/package/cardano-web3-js"><img alt="NPM" src="https://img.shields.io/npm/v/cardano-web3-js/latest?style=for-the-badge&logo=npm&labelColor=%231940ED&color=%233FCB9B">
<a href="https://github.com/ray-network/cardano-web3-js/actions"><img alt="CODEQL" src="https://img.shields.io/github/actions/workflow/status/xray-network/cardano-web3-js/codeql.yml?label=CodeQL&logo=github&style=for-the-badge&labelColor=%231940ED&color=%233FCB9B"></a>

  
# 🛠 Cardano Web3 JavaScript SDK

CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain. It supports both Node.js and browser environments, streamlining transaction creation, smart contract deployment, and data exploration. Ideal for developers, this toolkit simplifies Cardano cryptographic operations and API interactions

## Installation

To install with Yarn, run:

```TypeScript
yarn install cardano-web3-js
```

To install with NPM, run:

```TypeScript
npm i cardano-web3-js
```

## Documentation

* Playground: [https://xray.app/graph/cardano-web3-js](https://xray.app/graph/cardano-web3-js)
* Typedoc: [https://cardano-web3-js.github.io](https://cardano-web3-js.github.io/)

## Basic Usage

Check [/test](/test) folder for detailed usage examples. Or read the documentation to learn how to create a transaction of any complexity

``` ts
import { CardanoWeb3 } from "cardano-web3-js"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const mnemonic = web3.utils.keys.mnemonicGenerate()
  const account = web3.account.fromMnemonic(mnemonic)
  await account.updateState() // update balance & delegation info
  const { utxos } = account.__state

  console.log(mnemonic) // generated mnemonic
  console.log(account.__config) // account info (xpub, changeAddress, creds, etc)
  console.log(account.__state) // balance & delegation info

  const tx = await web3
    .createTx()
    .addInputs(utxos)
    .addOutput(
      {
        address: "addr1qxpm2aqmn48he8dtp9p8hk9gtew6cypy6ra3mgs8xkn86qmd3vtjzheq22w8mmfhm8agpmywnlu2rsxgkdrctv7mcc3s9anhjz",
        value: 2000000n,
      },
    )
    .applyAndBuild()

  const tx_hash = await tx_unsigned
    .signWithAccount(account)
    .applyAndSubmit()

  console.log(tx_hash)
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

  console.log(web3.network)
  console.log(web3.protocolParams)
  console.log(web3.slotConfig)
  console.log(web3.ttl)
}

app()
```
</details>

## Test

Check [/test](/test) folder for available tests

```TypeScript
yarn test
```
