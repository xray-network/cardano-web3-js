# Addresses

Here we will take a closer look at working with account addresses


## Deriving addresses from xpubKey

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const baseAddress = web3.utils.address.deriveBase("xpub...", [0, 0]) // [0, 0] = [addressType: 0 | 1, addressIndex: number]
const enterpriseAddress = web3.utils.address.deriveEnterprise("xpub...", [0, 0])
const stakingAddress = web3.utils.address.deriveStaking()
const stakinAddressFromAddress = web3.utils.address.getStakingAddress("addr1...)
```


## Get address info (credentials)

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const {
  type, // "base" | "pointer" | "enterprise" | "reward" | "byron"
  paymentCred, // { type, hash } if available
  stakingCred, // { type, hash } if available
} = web3.utils.getCredentials("addr1...)
```