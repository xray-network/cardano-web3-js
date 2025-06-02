---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "CardanoWeb3js"
  text: "Unlock the Full Potential of Cardano"
  image:
    src: /cardano-web3-js.svg
    alt: CardanoWeb3js
  tagline: "CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain"
  actions:
    - theme: brand
      text: Documentation
      link: /docs/quickstart
    - theme: alt
      text: Playground
      link: /playground
    - theme: alt
      text: GitHub
      link: https://github.com/xray-network/cardano-web3-js

features:
  - icon: 👨‍💻
    title: Build Decentralized Applications
    details: Leverage the power of Cardano's blockchain to create secure and scalable dApps. CardanoWeb3js library offers seamless integration and comprehensive tools for developers
  - icon: 🚀
    title: Unlock the Full Potential of Cardano
    details: Integrate Cardano blockchain functionality into your applications effortlessly with CW3js. Access robust features, from token transactions to smart contract interactions
  - icon: 🌐
    title: Transform Your Ideas into Reality
    details: CardanoWeb3js library empowers developers to build innovative blockchain solutions. Experience fast, reliable, and user-friendly tools for all your development needs
---



## Quickstart

```ts
import { CardanoWeb3, utils } from "cardano-web3-js"
const web3 = new CardanoWeb3()

const mnemonic = utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonic)
const state = await account.getState()

console.log("Mnemonic:", mnemonic)
console.log("Account Address:", account.__config.paymentAddress)
console.log("Account State:", state)
```

<br />
<hr />
<br />

CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain. It supports both Node.js and browser environments, streamlining transaction creation, smart contract deployment, and data exploration. Ideal for developers, this toolkit simplifies Cardano cryptographic operations and API interactions.

This library is a set of abstractions over various opensource libraries and SDKs that are required to work with the Cardano blockchain: [CML](https://github.com/dcSpark/cardano-multiplatform-lib) by dcSpark, [MSL](https://github.com/Emurgo/message-signing) by Emurgo, [UPLC](https://aiken-lang.org/uplc) by Aiken, [Plutus Data](https://github.com/spacebudz/lucid) by Spacebudz, and other.

## Features of CardanoWeb3js

<div class="two-cols">
  <div>

### **Feature-Rich**
  * [Private and public keys](/docs/accounts-and-keys) generation
  * [Accounts handling](/docs/accounts-and-keys)
    * With mnemonic
    * With private Key
    * With wallet connector
  * Built-in data providers ([Koios, Kupo+Ogmios](/docs/advanced-usage/providers))
  * Built-in blockchain explorer clients ([Koios](/docs/explorers/koios), [Ogmios](/docs/explorers/ogmios), [Kupo](/docs/explorers/kupo), [NFTCDN](/docs/explorers/xray-graph-nftcdn))
  * [Deriving payment, staking, script addresses](/docs/advanced-usage/addresses)
  * [Building, signing, and submitting transactions](/docs/transactions/basic-transactions)
  * [Data (messages) encryption and decryption](/docs/advanced-usage/sign-and-verify-message)
  * [Native Scripts building](/docs/transactions/basic-transactions)
  * [Plutus Data serialization / deserialization](/docs/transactions/smart-contracts-transactions) (with Static Types Resolution)

  </div>
  <div>

### **Developer-Friendly**
  * Well-typed and documented code (with unit tests)
  * [Typedoc API](/api/)
  * CommonJS (CJS) & ECMAScript (ESM) builds
  * Doesn't need any polyfills
  * For beginners and professionals alike

### **In Development**
  * HW wallets support
  * Pluggable architecture
  * Chainable TXs

  </div>
</div>




## Environment Support

<table style="width: 100%; display: table">
  <thead>
    <tr>
      <th style="width: 33%">Browser (Bundler)</th>
      <th style="width: 33%">Nodejs</th>
      <th style="width: 33%">Web</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>✅</td>
      <td>✅</td>
      <td>✅</td>
    </tr>
    <tr>
      <td>Outputs JS that is suitable for interoperation with a Bundler like Webpack</td>
      <td>Outputs JS that uses CommonJS modules and ESM modules to run in NodeJS environments of various versions</td>
      <td>Outputs JS that can be natively imported as an ES module in a browser. Works with Serverless environs such as Cloudflare Workers</td>
    </tr>
  </tbody>
</table>

## Development

CardanoWeb3js is under active development: architectures, methods, and approaches can change rapidly, so you can get actively involved by visiting our repository. 

* Repository: https://github.com/xray-network/cardano-web3-js
* Issues: https://github.com/xray-network/cardano-web3-js/issues
