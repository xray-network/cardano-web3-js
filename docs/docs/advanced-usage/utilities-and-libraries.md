# Utilities & Libraries

The utilities object contains various useful functions and libraries

## Utilities

```ts
import { utils } from "cardano-web3-js"

const {
  account,
  address,
  asset,
  governance,
  keys,
  misc,
  script,
  time,
  tx
} = utils

const xpub = keys.xprvKeyToXpubKey("xprv...", [1852, 1815, 0], [0, 0]) // [AccountDerivationPath] and [AddressDerivationPath] are optional
const mnemonic = keys.mnemonicGenerate() // 24 words mnemonic (default)
const mnemonic24 = keys.mnemonicGenerate(24) // 24 words mnemonic
const mnemonic15 = keys.mnemonicGenerate(15) // 15 words mnemonic
const xprvKey = keys.xprvKeyGenerate() // direct ed25519_bip32 root key generation
const paymentKey = keys.xprvToVrfKey("xprv...", [1852, 1815, 0], [0, 0]) // [AccountDerivationPath] and [AddressDerivationPath] are optional
const currentSlot = time.unixTimeToSlot(Date.now()) // current absolute slot
const { checksumImage, checksumId } = account.checksum("xpub...") // generating CIP-4 (Wallet Checksums)
const stakingAddress = address.getStakingAddress("addr1...") // get staking address from address

// etc...
```


## Third-party Libs

```ts
import {
  CML, // dcSpark @ Cardano Multiplatform Library
  MSL, // Emurgo @ Message Signing Library
  UPLC, // UPLC @ Untyped Plutus Core Library
  Message, // Message Signing/Verification lib (MSL abstraction)
  PlutusData, // Lucid Plutus Data Serialization Lib
  PlutusConstr, // Lucid Plutus Data Construction Lib
} from "cardano-web3-js"

```