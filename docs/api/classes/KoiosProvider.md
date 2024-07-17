[cardano-web3-js](../index.md) / KoiosProvider

# Class: KoiosProvider

## Implements

- [`Provider`](../namespaces/T/type-aliases/Provider.md)

## Constructors

### new KoiosProvider()

> **new KoiosProvider**(`baseUrl`, `headers`?): [`KoiosProvider`](KoiosProvider.md)

#### Parameters

• **baseUrl**: `string`

• **headers?**: [`Headers`](../namespaces/T/type-aliases/Headers.md)

#### Returns

[`KoiosProvider`](KoiosProvider.md)

#### Defined in

[src/provider/koios/index.ts:8](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L8)

## Methods

### evaluateTx()

> **evaluateTx**(`tx`): `Promise`\<[`RedeemerCost`](../namespaces/T/type-aliases/RedeemerCost.md)[]\>

#### Parameters

• **tx**: `string`

#### Returns

`Promise`\<[`RedeemerCost`](../namespaces/T/type-aliases/RedeemerCost.md)[]\>

#### Implementation of

`T.Provider.evaluateTx`

#### Defined in

[src/provider/koios/index.ts:146](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L146)

***

### getDatumByHash()

> **getDatumByHash**(`datumHash`): `Promise`\<`string`\>

#### Parameters

• **datumHash**: `string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`T.Provider.getDatumByHash`

#### Defined in

[src/provider/koios/index.ts:103](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L103)

***

### getDelegation()

> **getDelegation**(`stakingAddress`): `Promise`\<[`AccountDelegation`](../namespaces/T/type-aliases/AccountDelegation.md)\>

#### Parameters

• **stakingAddress**: `string`

#### Returns

`Promise`\<[`AccountDelegation`](../namespaces/T/type-aliases/AccountDelegation.md)\>

#### Implementation of

`T.Provider.getDelegation`

#### Defined in

[src/provider/koios/index.ts:130](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L130)

***

### getProtocolParameters()

> **getProtocolParameters**(): `Promise`\<[`ProtocolParameters`](../namespaces/T/type-aliases/ProtocolParameters.md)\>

#### Returns

`Promise`\<[`ProtocolParameters`](../namespaces/T/type-aliases/ProtocolParameters.md)\>

#### Implementation of

`T.Provider.getProtocolParameters`

#### Defined in

[src/provider/koios/index.ts:28](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L28)

***

### getScriptByHash()

> **getScriptByHash**(`scriptHash`): `Promise`\<[`Script`](../namespaces/T/type-aliases/Script.md)\>

#### Parameters

• **scriptHash**: `string`

#### Returns

`Promise`\<[`Script`](../namespaces/T/type-aliases/Script.md)\>

#### Implementation of

`T.Provider.getScriptByHash`

#### Defined in

[src/provider/koios/index.ts:115](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L115)

***

### getTip()

> **getTip**(): `Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

#### Returns

`Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

#### Implementation of

`T.Provider.getTip`

#### Defined in

[src/provider/koios/index.ts:12](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L12)

***

### getUtxoByOutputRef()

> **getUtxoByOutputRef**(`txHash`, `index`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)\>

#### Parameters

• **txHash**: `string`

• **index**: `number`

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)\>

#### Implementation of

`T.Provider.getUtxoByOutputRef`

#### Defined in

[src/provider/koios/index.ts:74](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L74)

***

### getUtxosByAddress()

> **getUtxosByAddress**(`address`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Parameters

• **address**: `string`

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Implementation of

`T.Provider.getUtxosByAddress`

#### Defined in

[src/provider/koios/index.ts:70](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L70)

***

### getUtxosByAddresses()

> **getUtxosByAddresses**(`addresses`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Parameters

• **addresses**: `string`[]

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Implementation of

`T.Provider.getUtxosByAddresses`

#### Defined in

[src/provider/koios/index.ts:43](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L43)

***

### observeTx()

> **observeTx**(`txHash`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

#### Parameters

• **txHash**: `string`

• **checkInterval**: `number` = `3000`

• **maxTime**: `number` = `...`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`T.Provider.observeTx`

#### Defined in

[src/provider/koios/index.ts:163](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L163)

***

### resolveUtxoDatumAndScript()

> **resolveUtxoDatumAndScript**(`utxo`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)\>

#### Parameters

• **utxo**: [`Utxo`](../namespaces/T/type-aliases/Utxo.md)

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)\>

#### Implementation of

`T.Provider.resolveUtxoDatumAndScript`

#### Defined in

[src/provider/koios/index.ts:87](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L87)

***

### resolveUtxosDatumAndScript()

> **resolveUtxosDatumAndScript**(`utxos`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Parameters

• **utxos**: [`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Defined in

[src/provider/koios/index.ts:95](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L95)

***

### submitAndObserveTx()

> **submitAndObserveTx**(`tx`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

#### Parameters

• **tx**: `string`

• **checkInterval**: `number` = `3000`

• **maxTime**: `number` = `...`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`T.Provider.submitAndObserveTx`

#### Defined in

[src/provider/koios/index.ts:206](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L206)

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

#### Parameters

• **tx**: `string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`T.Provider.submitTx`

#### Defined in

[src/provider/koios/index.ts:189](https://github.com/xray-network/cardano-web3-js/blob/main/src/provider/koios/index.ts#L189)
