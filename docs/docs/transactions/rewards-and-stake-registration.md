# Rewards and Stake Registration

This section covers how to manage rewards and stake registration using the Cardano Web3 library.

## Withdraw rewards

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
  .withdrawRewards(account.__config.stakingAddress!, account.__state.rewards) // 0n (bigint) for testing, you must use exact amount of existing rewards to withdraw
  .applyAndBuild()

const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

## Register and delegate stake

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
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

## Deregister stake

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
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