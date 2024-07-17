[cardano-web3-js](../index.md) / Account

# Class: Account

## Constructors

### new Account()

> **new Account**(): [`Account`](Account.md)

#### Returns

[`Account`](Account.md)

## Properties

### \_\_config

> **\_\_config**: [`AccountConfig`](../namespaces/T/type-aliases/AccountConfig.md)

#### Defined in

[src/core/account.ts:6](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L6)

***

### \_\_state

> **\_\_state**: [`AccountState`](../namespaces/T/type-aliases/AccountState.md)

#### Defined in

[src/core/account.ts:22](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L22)

## Methods

### decodeAndUpdateXprvKey()

> **decodeAndUpdateXprvKey**(`password`): `string`

Decode key from encrypted state and update internal state

#### Parameters

• **password**: `string`

Password to decrypt the key

#### Returns

`string`

Decoded xprv key

#### Defined in

[src/core/account.ts:264](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L264)

***

### decodeXprvKey()

> **decodeXprvKey**(`password`): `string`

Decode key from encrypted state

#### Parameters

• **password**: `string`

Password to decrypt the key

#### Returns

`string`

Decoded xprv key

#### Throws

Error if account is not encrypted or account type is wrong

#### Defined in

[src/core/account.ts:252](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L252)

***

### encodeAndUpdateXprvKey()

> **encodeAndUpdateXprvKey**(`password`): `string`

Encode key to encrypted state and update internal state

#### Parameters

• **password**: `string`

Password to encrypt the key

#### Returns

`string`

Encoded xprv key

#### Defined in

[src/core/account.ts:239](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L239)

***

### encodeXprvKey()

> **encodeXprvKey**(`password`): `string`

Encode key to encrypted state

#### Parameters

• **password**: `string`

Password to encrypt the key

#### Returns

`string`

Encoded xprv key

#### Throws

Error if account type is wrong or xprv key is not found

#### Throws

Error if account is already encrypted

#### Defined in

[src/core/account.ts:227](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L227)

***

### exportAccount()

> **exportAccount**(): [`AccountExportV1`](../namespaces/T/type-aliases/AccountExportV1.md)

Export account configuration

#### Returns

[`AccountExportV1`](../namespaces/T/type-aliases/AccountExportV1.md)

Account configuration

#### Throws

Error if account type is not exportable

#### Defined in

[src/core/account.ts:204](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L204)

***

### updateState()

> **updateState**(): `Promise`\<[`AccountState`](../namespaces/T/type-aliases/AccountState.md)\>

Get account state and update internal state

#### Returns

`Promise`\<[`AccountState`](../namespaces/T/type-aliases/AccountState.md)\>

Account state

#### Defined in

[src/core/account.ts:275](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L275)

***

### fromConnector()

> `static` **fromConnector**(`cw3`, `connector`): `Promise`\<[`Account`](Account.md)\>

Create a new account from connector

#### Parameters

• **cw3**: [`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

• **connector**: [`Connector`](Connector.md)

Connector instance

#### Returns

`Promise`\<[`Account`](Account.md)\>

Account instance

#### Defined in

[src/core/account.ts:120](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L120)

***

### fromMnemonic()

> `static` **fromMnemonic**(`cw3`, `mnemonic`, `accountPath`, `addressPath`): [`Account`](Account.md)

Create a new account from mnemonic

#### Parameters

• **cw3**: [`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

• **mnemonic**: `string`

24-word mnemonic

• **accountPath**: [`AccountDerivationPath`](../namespaces/T/type-aliases/AccountDerivationPath.md)

Account derivation path (e.g. [1852, 1815, 0])

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

[`Account`](Account.md)

Account instance

#### Defined in

[src/core/account.ts:40](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L40)

***

### fromXprvKey()

> `static` **fromXprvKey**(`cw3`, `xprvKey`, `accountPath`, `addressPath`): [`Account`](Account.md)

Create a new account from xprv key

#### Parameters

• **cw3**: [`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

• **xprvKey**: `string`

Extended private key

• **accountPath**: [`AccountDerivationPath`](../namespaces/T/type-aliases/AccountDerivationPath.md)

Account derivation path (e.g. [1852, 1815, 0])

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

[`Account`](Account.md)

Account instance

#### Defined in

[src/core/account.ts:58](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L58)

***

### fromXpubKey()

> `static` **fromXpubKey**(`cw3`, `xpubKey`, `addressPath`): [`Account`](Account.md)

Create a new account from xpub key (limited functionality)

#### Parameters

• **cw3**: [`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

• **xpubKey**: `string`

Extended public key

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md)

Address derivation path (e.g. [0, 0])

#### Returns

[`Account`](Account.md)

Account instance

#### Defined in

[src/core/account.ts:92](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L92)

***

### importAccount()

> `static` **importAccount**(`cw3`, `config`): [`Account`](Account.md)

Import an account from configuration

#### Parameters

• **cw3**: [`CardanoWeb3`](CardanoWeb3.md)

CardanoWeb3 instance

• **config**: [`AccountExportV1`](../namespaces/T/type-aliases/AccountExportV1.md)

Account configuration

#### Returns

[`Account`](Account.md)

Account instance

#### Defined in

[src/core/account.ts:175](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/core/account.ts#L175)
