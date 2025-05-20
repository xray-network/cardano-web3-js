[cardano-web3-js](../index.md) / Account

# Class: Account

Defined in: [core/account.ts:7](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L7)

## Constructors

### Constructor

> **new Account**(): `Account`

#### Returns

`Account`

## Properties

### \_\_config

> **\_\_config**: [`AccountConfig`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountConfig.md)

Defined in: [core/account.ts:9](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L9)

## Methods

### exportAccount()

> **exportAccount**(): [`AccountExportV1`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountExportV1.md)

Defined in: [core/account.ts:230](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L230)

Export account configuration

#### Returns

[`AccountExportV1`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountExportV1.md)

Account configuration

***

### getDecodedXprvKey()

> **getDecodedXprvKey**(`password`): `string`

Defined in: [core/account.ts:264](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L264)

Decode key from encrypted state

#### Parameters

##### password

`string`

Password to decrypt the key

#### Returns

`string`

Decoded xprv key

#### Throws

Error if account is not encrypted or account type is wrong

***

### getDelegation()

> **getDelegation**(): `Promise`\<[`AccountDelegation`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDelegation.md)\>

Defined in: [core/account.ts:316](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L316)

#### Returns

`Promise`\<[`AccountDelegation`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDelegation.md)\>

***

### getEncodedXprvKey()

> **getEncodedXprvKey**(`password`): `string`

Defined in: [core/account.ts:251](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L251)

Encode key to encrypted state

#### Parameters

##### password

`string`

Password to encrypt the key

#### Returns

`string`

Encoded xprv key

#### Throws

Error if account type is wrong or xprv key is not found

#### Throws

Error if account is already encrypted

***

### getState()

> **getState**(): `Promise`\<[`AccountState`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountState.md)\>

Defined in: [core/account.ts:276](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L276)

Get account state and update internal state

#### Returns

`Promise`\<[`AccountState`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountState.md)\>

Account state

***

### fromAddress()

> `static` **fromAddress**(`cw3`, `address`): `Account`

Defined in: [core/account.ts:150](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L150)

Create a new account from address

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### address

`string`

Bech32 address

#### Returns

`Account`

Account instance

***

### fromConnector()

> `static` **fromConnector**(`cw3`, `connector`): `Promise`\<`Account`\>

Defined in: [core/account.ts:117](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L117)

Create a new account from connector

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### connector

[`Connector`](Connector.md)

Connector instance

#### Returns

`Promise`\<`Account`\>

Account instance

***

### fromMnemonic()

> `static` **fromMnemonic**(`cw3`, `mnemonic`, `password`, `accountPath`, `addressPath`): `Account`

Defined in: [core/account.ts:34](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L34)

Create a new account from mnemonic

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### mnemonic

`string`

24-word mnemonic

##### password

`string`

##### accountPath

[`AccountDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDerivationPath.md)

Account derivation path (e.g. [1852, 1815, 0])

##### addressPath

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

`Account`

Account instance

***

### fromXprvKey()

> `static` **fromXprvKey**(`cw3`, `xprvKey`, `password`, `accountPath`, `addressPath`): `Account`

Defined in: [core/account.ts:53](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L53)

Create a new account from xprv key

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### xprvKey

`string`

Extended private key

##### password

`string`

##### accountPath

[`AccountDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDerivationPath.md)

Account derivation path (e.g. [1852, 1815, 0])

##### addressPath

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

`Account`

Account instance

***

### fromXpubKey()

> `static` **fromXpubKey**(`cw3`, `xpubKey`, `addressPath`): `Account`

Defined in: [core/account.ts:89](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L89)

Create a new account from xpub key (limited functionality)

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### xpubKey

`string`

Extended public key

##### addressPath

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

`Account`

Account instance

***

### importAccount()

> `static` **importAccount**(`cw3`, `config`): `Account`

Defined in: [core/account.ts:199](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/account.ts#L199)

Import an account from configuration

#### Parameters

##### cw3

[`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

##### config

[`AccountExportV1`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountExportV1.md)

Account configuration

#### Returns

`Account`

Account instance
