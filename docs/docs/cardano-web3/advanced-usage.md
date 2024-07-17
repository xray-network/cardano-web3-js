# Advanced Usage

This section will tell you how to create Native Script, Plutus Data, or sign and verify a message

## Native Script

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...)

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

console.log(policyId) // PolicyID
console.log(script) // Native Script
```

## Plutus Data

```ts
import { CardanoWeb3, Data } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const { Data, Constr } = web3

const datum = Data.to(new Constr(0, [web3.utils.misc.fromStringToHex("Hello, World!")]))

console.log(datum)
```

## Plutus Data (with Type Builder)

```ts
import { CardanoWeb3, Data } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const { Data, Constr } = web3

const MyDatumSchema = web3.Data.Object({
  myVariableA: web3.Data.Bytes(),
  myVariableB: web3.Data.Nullable(web3.Data.Integer()),
})
type MyDatum = Data.Static<typeof MyDatumSchema>
const MyDatum = MyDatumSchema as unknown as MyDatum
const datum = web3.Data.to(
  {
    myVariableA: "313131",
    myVariableB: 5555n,
  },
  MyDatum
)

console.log(datum)
```

## Sign and verify message (with account)

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()
const account = web3.account.fromXprvKey("xprv...)

const message = "Hello, World!"
const signature = await web3.signMessageWithAccount(account, message) // signMessageWithAccount(account, message, "password123") add password if account is encrypted
const verified = web3.verifyMessage(account.__config.paymentAddress, message, signature)

console.log(verified) // to be true
```

## Sign and verify message (with private key)

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const message = "Hello, World!"
const verificationKey = web3.utils.keys.xprvToVrfKey("xprv...", [1852, 1815, 0], [0, 0]) // [AccountDerivationPath] and [AddressDerivationPath] are optional
const signature = web3.signMessageWithVrfKey(verificationKey, testData.paymentAddress, message)
const verified = web3.verifyMessage(testData.paymentAddress, message, signature)
expect(verified).toBe(true)

console.log(verified) // to be true
```
