# Advanced Usage

This section will tell you how to create Native Script, Plutus Data, or sign and verify a message

## Sign and verify message (with account)

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")

const message = "Hello, World!"
const signature = await web3.message.signWithAccount(account, message) // signMessageWithAccount(account, message, "password123") add password if account is encrypted
const verified = web3.message.verify(account.__config.paymentAddress, message, signature)

console.log(verified) // to be true
```

## Sign and verify message (with private key)

```ts
import { CardanoWeb3, utils } from "cardano-web3-js"

const web3 = new CardanoWeb3()

const message = "Hello, World!"
const verificationKey = utils.keys.xprvToVrfKey("xprv...", [1852, 1815, 0], [0, 0]) // [AccountDerivationPath] and [AddressDerivationPath] are optional
const signature = web3.message.signWithVrfKey(verificationKey, testData.paymentAddress, message)
const verified = web3.message.verify(testData.paymentAddress, message, signature)
expect(verified).toBe(true)

console.log(verified) // to be true
```
