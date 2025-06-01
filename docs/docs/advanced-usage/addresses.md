# Addresses

Here we will take a closer look at working with account addresses


## Deriving addresses from xpubKey

```ts
import { utils } from "cardano-web3-js"


const baseAddress = utils.address.deriveBase("xpub...", [0, 0], 1) // [0, 0] = [addressType: 0 | 1, addressIndex: number], 1 = mainnet network id (0 for testnet)
const enterpriseAddress = utils.address.deriveEnterprise("xpub...", [0, 0], 1) // [0, 0] = [addressType: 0 | 1, addressIndex: number], 1 = mainnet network id (0 for testnet)
const stakingAddress = utils.address.deriveStaking("xpub...", 1)  // 1 = mainnet network id (0 for testnet)
const stakinAddressFromAddress = utils.address.getStakingAddress("addr1...)
```


## Get address info (credentials)

```ts
import { utils } from "cardano-web3-js"

const {
  type, // "base" | "pointer" | "enterprise" | "reward" | "byron"
  paymentCred, // { type, hash } if available
  stakingCred, // { type, hash } if available
} = utils.getCredentials("addr1...)
```