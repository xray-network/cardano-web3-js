[cardano-web3-js](../index.md) / Connector

# Class: Connector

## Constructors

### new Connector()

> **new Connector**(): [`Connector`](Connector.md)

#### Returns

[`Connector`](Connector.md)

## Properties

### \_\_api

> **\_\_api**: `any`

#### Defined in

[src/core/connector.ts:11](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L11)

## Methods

### getBalance()

> **getBalance**(): `Promise`\<`string`\>

Get wallet balance

#### Returns

`Promise`\<`string`\>

Wallet balance

#### Defined in

[src/core/connector.ts:85](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L85)

***

### getChangeAddress()

> **getChangeAddress**(): `Promise`\<`string`\>

Get wallet change address

#### Returns

`Promise`\<`string`\>

Change address

#### Defined in

[src/core/connector.ts:110](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L110)

***

### getCollateral()

> **getCollateral**(): `Promise`\<`string`[]\>

Get wallet collaterals

#### Returns

`Promise`\<`string`[]\>

List of collaterals

#### Defined in

[src/core/connector.ts:77](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L77)

***

### getExtensions()

> **getExtensions**(): `Promise`\<`any`[]\>

Get wallet extensions

#### Returns

`Promise`\<`any`[]\>

Wallet extensions

#### Defined in

[src/core/connector.ts:51](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L51)

***

### getNetworkId()

> **getNetworkId**(): `Promise`\<`number`\>

Get wallet network ID

#### Returns

`Promise`\<`number`\>

Wallet network ID (0 or 1)

#### Defined in

[src/core/connector.ts:59](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L59)

***

### getRewardAddresses()

> **getRewardAddresses**(): `Promise`\<`string`[]\>

Get wallet staking addresses

#### Returns

`Promise`\<`string`[]\>

Staking addresses

#### Defined in

[src/core/connector.ts:118](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L118)

***

### getUnusedAddresses()

> **getUnusedAddresses**(): `Promise`\<`string`[]\>

Get wallet unused addresses

#### Returns

`Promise`\<`string`[]\>

Array of unused addresses

#### Defined in

[src/core/connector.ts:102](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L102)

***

### getUsedAddresses()

> **getUsedAddresses**(`paginate`?): `Promise`\<`string`[]\>

Get wallet used addresses

#### Parameters

• **paginate?**: [`ConnectorPaginate`](../namespaces/T/type-aliases/ConnectorPaginate.md)

Pagination options

#### Returns

`Promise`\<`string`[]\>

Array of used addresses

#### Defined in

[src/core/connector.ts:94](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L94)

***

### getUtxos()

> **getUtxos**(`amount`?, `paginate`?): `Promise`\<`string`[]\>

Get wallet UTXOs

#### Parameters

• **amount?**: `string`

Amount to filter UTXOs

• **paginate?**: [`ConnectorPaginate`](../namespaces/T/type-aliases/ConnectorPaginate.md)

Pagination options

#### Returns

`Promise`\<`string`[]\>

List of UTXOs

#### Defined in

[src/core/connector.ts:69](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L69)

***

### signData()

> **signData**(`addr`, `payload`): `Promise`\<[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)\>

Sign a message

#### Parameters

• **addr**: `string`

Address to sign message

• **payload**: `string`

Message to sign

#### Returns

`Promise`\<[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)\>

Signed message

#### Defined in

[src/core/connector.ts:138](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L138)

***

### signTx()

> **signTx**(`tx`, `partialSign`): `Promise`\<`string`\>

Sign a transaction

#### Parameters

• **tx**: `string`

Transaction to sign in CBOR format

• **partialSign**: `boolean` = `false`

Partial sign flag (boolean)

#### Returns

`Promise`\<`string`\>

Staking key

#### Defined in

[src/core/connector.ts:128](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L128)

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Submit a transaction

#### Parameters

• **tx**: `string`

Transaction to submit in CBOR format

#### Returns

`Promise`\<`string`\>

Transaction hash

#### Defined in

[src/core/connector.ts:147](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L147)

***

### init()

> `static` **init**(`wallet`, `extensions`?): `Promise`\<[`Connector`](Connector.md)\>

Initialize a wallet connector

#### Parameters

• **wallet**: `string`

Wallet name

• **extensions?**: `any`

Wallet extensions

#### Returns

`Promise`\<[`Connector`](Connector.md)\>

Connector instance

#### Defined in

[src/core/connector.ts:38](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L38)

***

### isEnabled()

> `static` **isEnabled**(`wallet`): `Promise`\<`string`[]\>

Check if a wallet is enabled

#### Parameters

• **wallet**: `string`

Wallet name

#### Returns

`Promise`\<`string`[]\>

True if wallet is enabled

#### Defined in

[src/core/connector.ts:27](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L27)

***

### list()

> `static` **list**(): `Promise`\<`string`[]\>

List available wallets

#### Returns

`Promise`\<`string`[]\>

List of available wallets

#### Defined in

[src/core/connector.ts:17](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/connector.ts#L17)
