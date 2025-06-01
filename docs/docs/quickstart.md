# Quickstart

## Install CardanoWeb3js

Install CardanoWeb3js via your package manager of choice. The library is available on npm, yarn, pnpm, and bun.

:::tabs
== npm
```sh
npm i cardano-web3-js
```
== yarn
```sh
yarn add cardano-web3-js
```
== pnpm
```sh
pnpm add cardano-web3-js
```
== bun
```sh
bun add cardano-web3-js
```
:::



## Retrieving blockchain tip

Retrieving the current blockchain tip is a common operation when working with Cardano. The `CardanoWeb3` class provides a simple way to access this information.

```ts 
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3() // by default initiated with Koios mainnet provider
const tip = await web3.getTip()

console.log(tip) // tip object

```


## Generating mnemonic, creating account from it, and get account state

Example of generating a mnemonic, creating an account from it, and retrieving the account state. This is useful for managing accounts and accessing blockchain data.

```ts
import { CardanoWeb3, utils } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const mnemonic = utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonic)
const state = await account.getState()

console.log(mnemonic) // generated mnemonic
console.log(account.__config) // account details (private and public keys, derivation info, etc...)
console.log(state) // account state (utxo, aggregated balance, pool delegation, available rewards) via provider

```


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