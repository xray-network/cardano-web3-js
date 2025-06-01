# Mint and Burn Transactions

Minting and burning tokens on the Cardano blockchain is a common operation, especially for NFTs (Non-Fungible Tokens). This guide will help you understand how to build mint and burn transactions using the Cardano Web3 JavaScript library.

## Build Mint TX (with metadata)

```ts
import { CardanoWeb3, utils } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const { paymentCred } = account.__config // or get from address with utils.address.getCredentials("addr1...").paymentCred.hash
const { policyId, script } = utils.script.nativeScriptFromJson({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCred },
    {
      type: "before",
      slot: utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
    },
  ],
})

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress) // will be sent to this address, or addInputs() with newly minted token
  .addInputs(state.utxos)
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

## Build Burn TX

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const { paymentCred } = account.__config // or get from address with utils.address.getCredentials("addr1...").paymentCred.hash
const { policyId, script } = utils.script.nativeScriptFromJson({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCred },
    {
      type: "before",
      slot: utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
    },
  ],
})

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
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
