# Accounts & Keys

Here we will learn how to generate accounts and get data from the blockchain about it

## __config & __state

See type definitions of [__config](/api/namespaces/T/type-aliases/AccountConfig) and [__state](/api/namespaces/T/type-aliases/AccountState) in API

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const mnemonicGenerated = web3.utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonicGenerated)

await account.updateState() // update state (utxo, aggregated balance, pool delegation, available rewards) via provider

console.log(account.__config)
console.log(account.__state)
```


## From mnemonic

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const mnemonicGenerated = web3.utils.keys.mnemonicGenerate()
const account = web3.account.fromMnemonic(mnemonicGenerated)

console.log(account.__config)
```


## From private key

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

// Mnemonic can be decoded to xprvKey also
// const mnemonicGenerated = web3.utils.keys.mnemonicGenerate()
// const xprvKeyGenerated = web3.utils.keys.mnemonicToXprvKey(mnemonicGenerated)

const xprvKeyGenerated = web3.utils.keys.xprvKeyGenerate()
const account = web3.account.fromXprvKey(xprvKeyGenerated)

console.log(account.__config)
```


## From public key 
Read only, you cannot sign a tx with this account when creating a tx

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const account = web3.account.fromXpubKey("xpub...")

console.log(account.__config)
```


## From wallet connector
Available only in the browser env

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

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

const web3 = await CardanoWeb3.init()

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

const web3 = await CardanoWeb3.init()

const account = web3.account.fromXprvKey("xprv...")
const exportedJson = account.exportAccount(
const importedAccount = web3.account.importAccount(exportedJson)

console.log(importedAccount.__config)
```