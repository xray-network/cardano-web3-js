[cardano-web3-js](../index.md) / Connector

# Class: Connector

Defined in: [core/connector.ts:9](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L9)

## Constructors

### Constructor

> **new Connector**(): `Connector`

#### Returns

`Connector`

## Properties

### \_\_api

> **\_\_api**: `any`

Defined in: [core/connector.ts:10](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L10)

## Methods

### getBalance()

> **getBalance**(): `Promise`\<`string`\>

Defined in: [core/connector.ts:86](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L86)

Get wallet balance

#### Returns

`Promise`\<`string`\>

Wallet balance

***

### getChangeAddress()

> **getChangeAddress**(): `Promise`\<`string`\>

Defined in: [core/connector.ts:111](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L111)

Get wallet change address

#### Returns

`Promise`\<`string`\>

Change address

***

### getCollateral()

> **getCollateral**(): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:78](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L78)

Get wallet collaterals

#### Returns

`Promise`\<`string`[]\>

List of collaterals

***

### getExtensions()

> **getExtensions**(): `Promise`\<`any`[]\>

Defined in: [core/connector.ts:52](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L52)

Get wallet extensions

#### Returns

`Promise`\<`any`[]\>

Wallet extensions

***

### getNetworkId()

> **getNetworkId**(): `Promise`\<`0` \| `1`\>

Defined in: [core/connector.ts:60](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L60)

Get wallet network ID

#### Returns

`Promise`\<`0` \| `1`\>

Wallet network ID (0 or 1)

***

### getRewardAddresses()

> **getRewardAddresses**(): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:119](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L119)

Get wallet staking addresses

#### Returns

`Promise`\<`string`[]\>

Staking addresses

***

### getUnusedAddresses()

> **getUnusedAddresses**(): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:103](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L103)

Get wallet unused addresses

#### Returns

`Promise`\<`string`[]\>

Array of unused addresses

***

### getUsedAddresses()

> **getUsedAddresses**(`paginate?`): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:95](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L95)

Get wallet used addresses

#### Parameters

##### paginate?

[`ConnectorPaginate`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ConnectorPaginate.md)

Pagination options

#### Returns

`Promise`\<`string`[]\>

Array of used addresses

***

### getUtxos()

> **getUtxos**(`amount?`, `paginate?`): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:70](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L70)

Get wallet UTXOs

#### Parameters

##### amount?

`string`

Amount to filter UTXOs

##### paginate?

[`ConnectorPaginate`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ConnectorPaginate.md)

Pagination options

#### Returns

`Promise`\<`string`[]\>

List of UTXOs

***

### signData()

> **signData**(`addr`, `payload`): `Promise`\<[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)\>

Defined in: [core/connector.ts:139](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L139)

Sign a message

#### Parameters

##### addr

`string`

Address to sign message

##### payload

`string`

Message to sign

#### Returns

`Promise`\<[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)\>

Signed message

***

### signTx()

> **signTx**(`tx`, `partialSign`): `Promise`\<`string`\>

Defined in: [core/connector.ts:129](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L129)

Sign a transaction

#### Parameters

##### tx

`string`

Transaction to sign in CBOR format

##### partialSign

`boolean` = `false`

Partial sign flag (boolean)

#### Returns

`Promise`\<`string`\>

Staking key

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Defined in: [core/connector.ts:148](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L148)

Submit a transaction

#### Parameters

##### tx

`string`

Transaction to submit in CBOR format

#### Returns

`Promise`\<`string`\>

Transaction hash

***

### init()

> `static` **init**(`wallet`, `extensions?`): `Promise`\<`Connector`\>

Defined in: [core/connector.ts:39](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L39)

Initialize a wallet connector

#### Parameters

##### wallet

`string`

Wallet name

##### extensions?

`any`

Wallet extensions

#### Returns

`Promise`\<`Connector`\>

Connector instance

***

### isEnabled()

> `static` **isEnabled**(`wallet`): `Promise`\<`boolean`\>

Defined in: [core/connector.ts:28](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L28)

Check if a wallet is enabled

#### Parameters

##### wallet

`string`

Wallet name

#### Returns

`Promise`\<`boolean`\>

True if wallet is enabled

***

### list()

> `static` **list**(): `Promise`\<`string`[]\>

Defined in: [core/connector.ts:16](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/connector.ts#L16)

List available wallets

#### Returns

`Promise`\<`string`[]\>

List of available wallets
