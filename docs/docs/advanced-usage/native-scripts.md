# Advanced Usage

This section will tell you how to create Native Script

## Native Script

```ts
import { CardanoWeb3, utils } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")

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

console.log(policyId) // PolicyID
console.log(script) // Native Script
```
