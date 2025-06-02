# Governance Actions

This section describes how to perform government actions such delegating votes to DRep, registering DRep, updating DRep, and deregistering DRep using the CardanoWeb3js library.

## Delegate Vote to DRep (AlwaysAbstain, AlwaysNoConfidence)

`AlwaysAbstain` and `AlwaysNoConfidence` are special voting options in Cardano governance that allow users to express their preference without actively participating in the vote.

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .governance.delegateToDRep(stakingAddress, "drep1...") // or "AlwaysAbstain", "AlwaysNoConfidence"
  .addInputs(state.utxos)
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

## Register DRep

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .governance.registerDRep(stakingAddress) // You can pass Anchor with second argument
  .addInputs(state.utxos)
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```


## Update DRep

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .governance.updateDRep(stakingAddress) // You can pass Anchor with second argument
  .addInputs(state.utxos)
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```


## Update DRep

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .governance.deregisterDRep(stakingAddress)
  .addInputs(state.utxos)
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```
