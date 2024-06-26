---
sidebar_position: 2
sidebar_label: "Basic Txs"
title: "Basic Transactions"
---

In this lesson, we will learn how to collect basic transactions, sign them, and send them to the network.

### Basic TX

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
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

### Mint TX (with metadata)

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const { paymentCred } = account.__config // or get from address with web3.utils.address.getCredentials("addr1...").paymentCred.hash
const { policyId, script } = web3.createNativeScript({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCred },
    {
      type: "before",
      slot: web3.utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
    },
  ],
})

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress) // will be sent to this address, or addInputs() with newly minted token
  .addInputs(account.__state.utxos)
  .attachScript(script)
  .addMetadataJson(
    721, // NFT label
    {
      mintedTo: "Poor developer",
      for: "buying a villa",
    }
  )
  .addMint([
    {
      policyId: policyId,
      assetName: "Bitcoin",
      quantity: 1000n, // Is 1000 bitcoins enough for a poor developer?
    },
  ])
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

### Burn TX

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const { paymentCred } = account.__config // or get from address with web3.utils.address.getCredentials("addr1...").paymentCred.hash
const { policyId, script } = web3.utils.script.nativeScriptFromJson({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCred },
    {
      type: "before",
      slot: web3.utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
    },
  ],
})

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
  .attachScript(script)
  .addMint([
    {
      policyId: policyId,
      assetName: "Bitcoin",
      quantity: -500n, // Poor developer bought a villa
    },
  ])
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

### Attach metadata

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
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

### Withdraw rewards

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
  .withdrawRewards(account.__config.stakingAddress!, account.__state.rewards) // 0n (bigint) for testing, you must use exact amount of existing rewards to withdraw
  .applyAndBuild()

const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

### Register and delegate stake

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
  .registerStake(account.__config.stakingAddress!)
  .delegateTo("pool1pn9sffcqqzkx70m0gujks4h3wf8p4y706t2f0cjcyreekg83wtf") // you can also use delegate stake in one TX
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

### Deregister stake

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...")
await account.updateState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(account.__state.utxos)
  .deregisterStake(account.__config.stakingAddress!)
  .applyAndBuild()

const tx_signed = await tx_build
  .signWithAccount(account)
  .applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)

```