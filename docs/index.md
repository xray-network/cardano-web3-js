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

<br />
<hr />
<br />

CardanoWeb3js is a versatile TypeScript library designed for seamless integration with the Cardano blockchain. It supports both Node.js and browser environments, streamlining transaction creation, smart contract deployment, and data exploration. Ideal for developers, this toolkit simplifies Cardano cryptographic operations and API interactions.

This library is a set of abstractions over various opensource libraries and SDKs that are required to work with the Cardano blockchain: [CML](https://github.com/dcSpark/cardano-multiplatform-lib) by dcSpark, [MSL](https://github.com/Emurgo/message-signing) by Emurgo, [UPLC](https://aiken-lang.org/uplc) by Aiken, [Plutus Data](https://github.com/spacebudz/lucid/tree/main/src/plutus) by Spacebudz, and other.

Building an SDK is always a compromise between functionality, ease of code understanding, and modularity. We think we've managed to find the middle ground on this one. We believe that you will enjoy the ease of working with CW3js! ✨

## Features of CardanoWeb3js

<div class="two-cols">
  <div>

### **Feature-Rich**
  * [Private and public keys](/docs/accounts/accounts-and-keys) generation
  * [Accounts handling](/docs/accounts/accounts-and-keys)
    * With mnemonic
    * With private Key
    * With wallet connector
  * Built-in data providers ([Koios, Kupo+Ogmios](/docs/cardano-web3/providers))
  * Built-in blockchain explorer clients ([Koios](/docs/explorers/koios), [NFTCDN](/docs/explorers/xray-graph-nftcdn), [Pricing](/docs/explorers/xray-graph-pricing))
  * [Deriving payment, staking, script addresses](/docs/accounts/addresses)
  * [Building, signing, and submitting transactions](/docs/transactions/basic-transactions)
  * [Data (messages) encryption and decryption](/docs/cardano-web3/advanced-usage)
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
  <tr>
    <td style="width: 33%">Node.js</td>
    <td style="width: 33%">Browser (CSR)</td>
    <td style="width: 33%">SSR</td>
  </tr>
  <tr>
    <td>✅</td>
    <td>✅</td>
    <td>✅</td>
  </tr>
</table>

<small>SSR involves prerendering pages with Node.js and executing them in the browser environment. Related concepts include SSR (Server-Side Rendering), SSG (Static Site Generation), ISR (Incremental Static Regeneration), and CSR (Client-Side Rendering)</small>

## Development

CardanoWeb3js is under active development: architectures, methods, and approaches can change rapidly, so you can get actively involved by visiting our repository: https://github.com/xray-network/cardano-web3-js

Issues: https://github.com/xray-network/cardano-web3-js/issues

<a href="https://github.com/xray-network/cardano-web3-js">![GitHub stars](https://img.shields.io/github/stars/xray-network/cardano-web3-js)</a>