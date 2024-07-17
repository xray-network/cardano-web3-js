[cardano-web3-js](../index.md) / KupmiosProvider

# Class: KupmiosProvider

## Implements

- [`Provider`](../namespaces/T/type-aliases/Provider.md)

## Constructors

### new KupmiosProvider()

> **new KupmiosProvider**(`__namedParameters`): [`KupmiosProvider`](KupmiosProvider.md)

#### Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.kupoHeaders?**: [`Headers`](../namespaces/T/type-aliases/Headers.md)

• **\_\_namedParameters.kupoUrl**: `string`

• **\_\_namedParameters.ogmiosHeaders?**: [`Headers`](../namespaces/T/type-aliases/Headers.md)

• **\_\_namedParameters.ogmiosUrl**: `string`

#### Returns

[`KupmiosProvider`](KupmiosProvider.md)

#### Defined in

[src/provider/kupmios/index.ts:11](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L11)

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

[src/provider/kupmios/index.ts:157](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L157)

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

[src/provider/kupmios/index.ts:109](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L109)

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

[src/provider/kupmios/index.ts:134](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L134)

***

### getProtocolParameters()

> **getProtocolParameters**(): `Promise`\<[`ProtocolParameters`](../namespaces/T/type-aliases/ProtocolParameters.md)\>

#### Returns

`Promise`\<[`ProtocolParameters`](../namespaces/T/type-aliases/ProtocolParameters.md)\>

#### Implementation of

`T.Provider.getProtocolParameters`

#### Defined in

[src/provider/kupmios/index.ts:44](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L44)

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

[src/provider/kupmios/index.ts:120](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L120)

***

### getTip()

> **getTip**(): `Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

#### Returns

`Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

#### Implementation of

`T.Provider.getTip`

#### Defined in

[src/provider/kupmios/index.ts:28](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L28)

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

[src/provider/kupmios/index.ts:82](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L82)

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

[src/provider/kupmios/index.ts:78](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L78)

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

[src/provider/kupmios/index.ts:60](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L60)

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

[src/provider/kupmios/index.ts:173](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L173)

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

[src/provider/kupmios/index.ts:93](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L93)

***

### resolveUtxosDatumAndScript()

> **resolveUtxosDatumAndScript**(`utxos`): `Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Parameters

• **utxos**: [`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]

#### Returns

`Promise`\<[`Utxo`](../namespaces/T/type-aliases/Utxo.md)[]\>

#### Defined in

[src/provider/kupmios/index.ts:101](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L101)

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

[src/provider/kupmios/index.ts:227](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L227)

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

[src/provider/kupmios/index.ts:202](https://github.com/xray-network/cardano-web3-js/blob/0efa60054f9e70c553f4bc789b93f1afba32576f/src/provider/kupmios/index.ts#L202)
