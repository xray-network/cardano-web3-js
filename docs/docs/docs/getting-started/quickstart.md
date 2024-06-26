---
sidebar_position: 2
sidebar_label: "Quickstart"
title: "Quickstart"
---

## Install CardanoWeb3js

```console
yarn install cardano-web3-js
```

#### Retrieving blockchain tip

```ts 
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init() // by default initiated with Koios mainnet provider
const tip = await web3.tip()

console.log(tip) // tip object

```


#### Generating mnemonic, creating account from it, and updating account state

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const mnemonic = web3.utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonic)

console.log(mnemonic) // generated mnemonic
console.log(account.__config) // account details (private and public keys, derivation info, etc...)
console.log(account.__state) // empty account state

await account.updateState()

console.log(account.__state) // update state (utxo, aggregated balance, pool delegation, available rewards) via provider

```

#### More examples

* [Basic usage](/docs/transactions/basic-transactions)
* [Smart Contracts](/docs/transactions/smart-contracts-transactions)