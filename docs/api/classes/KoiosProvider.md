[cardano-web3-js](../index.md) / KoiosProvider

# Class: KoiosProvider

Defined in: [providers/koios/index.ts:6](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L6)

## Implements

- [`Provider`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Provider.md)

## Constructors

### Constructor

> **new KoiosProvider**(`baseUrl`, `headers?`): `KoiosProvider`

Defined in: [providers/koios/index.ts:9](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L9)

#### Parameters

##### baseUrl

`string`

##### headers?

[`Headers`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Headers.md)

#### Returns

`KoiosProvider`

## Methods

### evaluateTx()

> **evaluateTx**(`tx`, `additionalUtxos?`): `Promise`\<[`RedeemerCost`](../cardano-web3-js/namespaces/CW3Types/type-aliases/RedeemerCost.md)[]\>

Defined in: [providers/koios/index.ts:147](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L147)

#### Parameters

##### tx

`string`

##### additionalUtxos?

[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]

#### Returns

`Promise`\<[`RedeemerCost`](../cardano-web3-js/namespaces/CW3Types/type-aliases/RedeemerCost.md)[]\>

#### Implementation of

`CW3Types.Provider.evaluateTx`

***

### getDatumByHash()

> **getDatumByHash**(`datumHash`): `Promise`\<`string`\>

Defined in: [providers/koios/index.ts:104](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L104)

#### Parameters

##### datumHash

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`CW3Types.Provider.getDatumByHash`

***

### getDelegation()

> **getDelegation**(`stakingAddress`): `Promise`\<[`AccountDelegation`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDelegation.md)\>

Defined in: [providers/koios/index.ts:131](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L131)

#### Parameters

##### stakingAddress

`string`

#### Returns

`Promise`\<[`AccountDelegation`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDelegation.md)\>

#### Implementation of

`CW3Types.Provider.getDelegation`

***

### getProtocolParameters()

> **getProtocolParameters**(): `Promise`\<[`ProtocolParameters`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ProtocolParameters.md)\>

Defined in: [providers/koios/index.ts:29](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L29)

#### Returns

`Promise`\<[`ProtocolParameters`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ProtocolParameters.md)\>

#### Implementation of

`CW3Types.Provider.getProtocolParameters`

***

### getScriptByHash()

> **getScriptByHash**(`scriptHash`): `Promise`\<[`Script`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Script.md)\>

Defined in: [providers/koios/index.ts:116](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L116)

#### Parameters

##### scriptHash

`string`

#### Returns

`Promise`\<[`Script`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Script.md)\>

#### Implementation of

`CW3Types.Provider.getScriptByHash`

***

### getTip()

> **getTip**(): `Promise`\<[`Tip`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Tip.md)\>

Defined in: [providers/koios/index.ts:13](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L13)

#### Returns

`Promise`\<[`Tip`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Tip.md)\>

#### Implementation of

`CW3Types.Provider.getTip`

***

### getUtxoByOutputRef()

> **getUtxoByOutputRef**(`txHash`, `index`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)\>

Defined in: [providers/koios/index.ts:75](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L75)

#### Parameters

##### txHash

`string`

##### index

`number`

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)\>

#### Implementation of

`CW3Types.Provider.getUtxoByOutputRef`

***

### getUtxosByAddress()

> **getUtxosByAddress**(`address`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

Defined in: [providers/koios/index.ts:71](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L71)

#### Parameters

##### address

`string`

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

#### Implementation of

`CW3Types.Provider.getUtxosByAddress`

***

### getUtxosByAddresses()

> **getUtxosByAddresses**(`addresses`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

Defined in: [providers/koios/index.ts:44](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L44)

#### Parameters

##### addresses

`string`[]

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

#### Implementation of

`CW3Types.Provider.getUtxosByAddresses`

***

### observeTx()

> **observeTx**(`txHash`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

Defined in: [providers/koios/index.ts:175](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L175)

#### Parameters

##### txHash

`string`

##### checkInterval

`number` = `3000`

##### maxTime

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

#### Implementation of

`CW3Types.Provider.observeTx`

***

### resolveUtxoDatumAndScript()

> **resolveUtxoDatumAndScript**(`utxo`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)\>

Defined in: [providers/koios/index.ts:88](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L88)

#### Parameters

##### utxo

[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)\>

#### Implementation of

`CW3Types.Provider.resolveUtxoDatumAndScript`

***

### resolveUtxosDatumAndScript()

> **resolveUtxosDatumAndScript**(`utxos`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

Defined in: [providers/koios/index.ts:96](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L96)

#### Parameters

##### utxos

[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

***

### submitAndObserveTx()

> **submitAndObserveTx**(`tx`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

Defined in: [providers/koios/index.ts:218](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L218)

#### Parameters

##### tx

`string`

##### checkInterval

`number` = `3000`

##### maxTime

`number` = `...`

#### Returns

`Promise`\<`boolean`\>

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Defined in: [providers/koios/index.ts:201](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/koios/index.ts#L201)

#### Parameters

##### tx

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`CW3Types.Provider.submitTx`
