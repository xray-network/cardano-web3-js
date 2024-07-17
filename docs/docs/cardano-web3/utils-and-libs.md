# Utilities & Libraries

The utilities object contains various useful functions and libraries

## Utilities

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const {
  account,
  address,
  address,
  assets,
  keys,
  misc,
  script,
  time,
  tx
} = web3.utils

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
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = await CardanoWeb3.init()

const {
  CML, // dcSpark @ Cardano Multiplatform Library
  MSL, // Emurgo @ Message Signing Library
  UPLC, // UPLC @ Untyped Plutus Core Library
  Message, // Message Signing/Verification lib (MSL abstraction)
  Data, // Lucid Plutus Data Serialization Lib
  Constr, // Lucid Plutus Data Construction Lib
} = web3

const {
  Bech32, // Bech32 encoding and decoding library
  Bip39, // Bip39 mnemonic library (only english words supported)
  Blake2b, // Blake2b hashing library
  Buffer, // Buffer polyfill for browser
  Cborg, // Implementation of the Concise Binary Object Representation (CBOR)
} = web3.utils
```