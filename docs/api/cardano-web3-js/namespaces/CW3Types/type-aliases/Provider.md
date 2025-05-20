[cardano-web3-js](../../../../index.md) / [CW3Types](../index.md) / Provider

# Type Alias: Provider

> **Provider** = `object`

Defined in: [types/index.ts:61](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L61)

Provider types

## Properties

### getTip()

> **getTip**: () => `Promise`\<[`Tip`](Tip.md)\>

Defined in: [types/index.ts:62](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L62)

#### Returns

`Promise`\<[`Tip`](Tip.md)\>

## Methods

### evaluateTx()

> **evaluateTx**(`tx`, `additionalUtxos?`): `Promise`\<[`RedeemerCost`](RedeemerCost.md)[]\>

Defined in: [types/index.ts:71](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L71)

#### Parameters

##### tx

`string`

##### additionalUtxos?

[`Utxo`](Utxo.md)[]

#### Returns

`Promise`\<[`RedeemerCost`](RedeemerCost.md)[]\>

***

### getDatumByHash()

> **getDatumByHash**(`datumHash`): `Promise`\<`string`\>

Defined in: [types/index.ts:68](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L68)

#### Parameters

##### datumHash

`string`

#### Returns

`Promise`\<`string`\>

***

### getDelegation()

> **getDelegation**(`stakingAddress`): `Promise`\<[`AccountDelegation`](AccountDelegation.md)\>

Defined in: [types/index.ts:70](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L70)

#### Parameters

##### stakingAddress

`string`

#### Returns

`Promise`\<[`AccountDelegation`](AccountDelegation.md)\>

***

### getProtocolParameters()

> **getProtocolParameters**(): `Promise`\<[`ProtocolParameters`](ProtocolParameters.md)\>

Defined in: [types/index.ts:63](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L63)

#### Returns

`Promise`\<[`ProtocolParameters`](ProtocolParameters.md)\>

***

### getScriptByHash()

> **getScriptByHash**(`scriptHash`): `Promise`\<[`Script`](Script.md)\>

Defined in: [types/index.ts:69](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L69)

#### Parameters

##### scriptHash

`string`

#### Returns

`Promise`\<[`Script`](Script.md)\>

***

### getUtxoByOutputRef()

> **getUtxoByOutputRef**(`txHash`, `index`): `Promise`\<[`Utxo`](Utxo.md)\>

Defined in: [types/index.ts:66](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L66)

#### Parameters

##### txHash

`string`

##### index

`number`

#### Returns

`Promise`\<[`Utxo`](Utxo.md)\>

***

### getUtxosByAddress()

> **getUtxosByAddress**(`address`): `Promise`\<[`Utxo`](Utxo.md)[]\>

Defined in: [types/index.ts:65](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L65)

#### Parameters

##### address

`string`

#### Returns

`Promise`\<[`Utxo`](Utxo.md)[]\>

***

### getUtxosByAddresses()

> **getUtxosByAddresses**(`address`): `Promise`\<[`Utxo`](Utxo.md)[]\>

Defined in: [types/index.ts:64](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L64)

#### Parameters

##### address

`string`[]

#### Returns

`Promise`\<[`Utxo`](Utxo.md)[]\>

***

### observeTx()

> **observeTx**(`txHash`, `checkInterval?`, `maxTime?`): `Promise`\<`boolean`\>

Defined in: [types/index.ts:73](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L73)

#### Parameters

##### txHash

`string`

##### checkInterval?

`number`

##### maxTime?

`number`

#### Returns

`Promise`\<`boolean`\>

***

### resolveUtxoDatumAndScript()

> **resolveUtxoDatumAndScript**(`utxo`): `Promise`\<[`Utxo`](Utxo.md)\>

Defined in: [types/index.ts:67](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L67)

#### Parameters

##### utxo

[`Utxo`](Utxo.md)

#### Returns

`Promise`\<[`Utxo`](Utxo.md)\>

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Defined in: [types/index.ts:72](https://github.com/xray-network/cardano-web3-js/blob/main/src/types/index.ts#L72)

#### Parameters

##### tx

`string`

#### Returns

`Promise`\<`string`\>
