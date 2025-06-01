# Basic Transactions

This guide will help you understand how to build basic transactions using the Cardano Web3 JavaScript library.

## Build Basic TX

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
  .addOutputs([
    {
      address: "addr1...",
      value: 2_000_000n,
      // assets: [
      //   {
      //     policyId: "policyId...",
      //     assetName: "assetName...",
      //     quantity: 100n,
      //   },
      // ]
    },
  ])
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

## Attach metadata

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
  .addMetadataJson(
    721, // NFT label
    {
      mintedTo: "Poor developer",
      for: "buying a villa",
    }
  )
  .addOutputs([
    {
      address: "addr1...",
      value: 2_000_000n,
      // assets: [
      //   {
      //     policyId: "policyId...",
      //     assetName: "assetName...",
      //     quantity: 100n,
      //   },
      // ]
    },
  ])
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
