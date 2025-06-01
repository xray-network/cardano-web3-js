# Accounts & Keys

This section describes how to create and manage accounts in CardanoWeb3js. An account is a collection of keys and configurations that allow you to interact with the Cardano blockchain.

## Account `config` and `state`

An account is an object that contains information about the account configuration and its state. The configuration includes details such as the type of account (e.g., mnemonic, xprv, xpub), keys, and derivation paths. The state includes information about the account's UTXOs, aggregated balance, pool delegation, and available rewards.

See type definitions of [AccountConfig](/api/cardano-web3-js/namespaces/CW3Types/type-aliases/AccountConfig) and [AccountState](/api/cardano-web3-js/namespaces/CW3Types/type-aliases/AccountState) in Typedoc API

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const mnemonicGenerated = utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonicGenerated)

const state = await account.getState() // account state (utxo, aggregated balance, pool delegation, available rewards) via provider

console.log(account.__config)
console.log(state)
```


## From mnemonic

Create account from mnemonic phrase, it will be used to derive xprvKey and xpubKey

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const mnemonicGenerated = utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonicGenerated)

console.log(account.__config)
```


## From private key

Create account from xprvKey previously generated

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

// Mnemonic can be decoded to xprvKey also
// const mnemonicGenerated = utils.keys.mnemonicGenerate()
// const xprvKeyGenerated = utils.keys.mnemonicToXprvKey(mnemonicGenerated)

const xprvKeyGenerated = utils.keys.xprvKeyGenerate()
const account = web3.account.fromXprvKey(xprvKeyGenerated)

console.log(account.__config)
```


## From public key 

Readonly account, no private key available so you can't sign transactions

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const account = web3.account.fromXpubKey("xpub...")

console.log(account.__config)
```


## From wallet connector

Available only in browser environment with Cardano wallet connector

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const wallets = await web3.connector.list() // list of available wallets in window.cardano object
console.log(wallets)

const connector = await web3.connector.init("eternl")
const account = await web3.account.fromConnector(connector)

console.log(account.__config)
```


## Password encryption
Available for account with "xprv" type

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const account = web3.account.fromXprvKey("xprv...")

account.encodeAndUpdateXprvKey("password123") // you can use also encodeXprvKey() for not updating account object
console.log(account.__config)

account.decodeAndUpdateXprvKey("password123") // you can use also decodeXprvKey() for not updating account object
console.log(account.__config)
```


## Export & import account
Available for accounts with type "xpub" | "xprv

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const account = web3.account.fromXprvKey("xprv...")
const exportedJson = account.exportAccount(
const importedAccount = web3.account.importAccount(exportedJson)

console.log(importedAccount.__config)
```