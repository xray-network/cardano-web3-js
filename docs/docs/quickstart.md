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
