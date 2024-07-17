[cardano-web3-js](../../../index.md) / [T](../index.md) / Provider

# Type Alias: Provider

> **Provider**: `object`

Provider types

## Type declaration

### getTip()

> **getTip**: () => `Promise`\<[`Tip`](Tip.md)\>

#### Returns

`Promise`\<[`Tip`](Tip.md)\>

### evaluateTx()

#### Parameters

• **tx**: `string`

#### Returns

`Promise`\<[`RedeemerCost`](RedeemerCost.md)[]\>

### getDatumByHash()

#### Parameters

• **datumHash**: `string`

#### Returns

`Promise`\<`string`\>

### getDelegation()

#### Parameters

• **stakingAddress**: `string`

#### Returns

`Promise`\<[`AccountDelegation`](AccountDelegation.md)\>

### getProtocolParameters()

#### Returns

`Promise`\<[`ProtocolParameters`](ProtocolParameters.md)\>

### getScriptByHash()

#### Parameters

• **scriptHash**: `string`

#### Returns

`Promise`\<[`Script`](Script.md)\>

### getUtxoByOutputRef()

#### Parameters

• **txHash**: `string`

• **index**: `number`

#### Returns

`Promise`\<[`Utxo`](Utxo.md)\>

### getUtxosByAddress()

#### Parameters

• **address**: `string`

#### Returns

`Promise`\<[`Utxo`](Utxo.md)[]\>

### getUtxosByAddresses()

#### Parameters

• **address**: `string`[]

#### Returns

`Promise`\<[`Utxo`](Utxo.md)[]\>

### observeTx()

#### Parameters

• **txHash**: `string`

• **checkInterval?**: `number`

• **maxTime?**: `number`

#### Returns

`Promise`\<`boolean`\>

### resolveUtxoDatumAndScript()

#### Parameters

• **utxo**: [`Utxo`](Utxo.md)

#### Returns

`Promise`\<[`Utxo`](Utxo.md)\>

### submitAndObserveTx()

#### Parameters

• **tx**: `string`

• **checkInterval?**: `number`

• **maxTime?**: `number`

#### Returns

`Promise`\<`boolean`\>

### submitTx()

#### Parameters

• **tx**: `string`

#### Returns

`Promise`\<`string`\>

## Defined in

[src/types/index.ts:51](https://github.com/xray-network/cardano-web3-js/blob/c2cd49478a527b9b57b4028f4ad7add1c4bff5b8/src/types/index.ts#L51)
