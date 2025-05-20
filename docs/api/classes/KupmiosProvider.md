[cardano-web3-js](../index.md) / KupmiosProvider

# Class: KupmiosProvider

Defined in: [providers/kupmios/index.ts:8](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L8)

## Implements

- [`Provider`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Provider.md)

## Constructors

### Constructor

> **new KupmiosProvider**(`__namedParameters`): `KupmiosProvider`

Defined in: [providers/kupmios/index.ts:12](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L12)

#### Parameters

##### \_\_namedParameters

###### kupoHeaders?

[`Headers`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Headers.md)

###### kupoUrl

`string`

###### ogmiosHeaders?

[`Headers`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Headers.md)

###### ogmiosUrl

`string`

#### Returns

`KupmiosProvider`

## Methods

### evaluateTx()

> **evaluateTx**(`tx`, `additionalUtxos?`): `Promise`\<[`RedeemerCost`](../cardano-web3-js/namespaces/CW3Types/type-aliases/RedeemerCost.md)[]\>

Defined in: [providers/kupmios/index.ts:168](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L168)

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

Defined in: [providers/kupmios/index.ts:116](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L116)

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

Defined in: [providers/kupmios/index.ts:147](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L147)

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

Defined in: [providers/kupmios/index.ts:43](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L43)

#### Returns

`Promise`\<[`ProtocolParameters`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ProtocolParameters.md)\>

#### Implementation of

`CW3Types.Provider.getProtocolParameters`

***

### getScriptByHash()

> **getScriptByHash**(`scriptHash`): `Promise`\<[`Script`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Script.md)\>

Defined in: [providers/kupmios/index.ts:130](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L130)

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

Defined in: [providers/kupmios/index.ts:27](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L27)

#### Returns

`Promise`\<[`Tip`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Tip.md)\>

#### Implementation of

`CW3Types.Provider.getTip`

***

### getUtxoByOutputRef()

> **getUtxoByOutputRef**(`txHash`, `index`): `Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)\>

Defined in: [providers/kupmios/index.ts:86](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L86)

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

Defined in: [providers/kupmios/index.ts:82](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L82)

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

Defined in: [providers/kupmios/index.ts:57](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L57)

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

Defined in: [providers/kupmios/index.ts:211](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L211)

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

Defined in: [providers/kupmios/index.ts:100](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L100)

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

Defined in: [providers/kupmios/index.ts:108](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L108)

#### Parameters

##### utxos

[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]

#### Returns

`Promise`\<[`Utxo`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Utxo.md)[]\>

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Defined in: [providers/kupmios/index.ts:189](https://github.com/xray-network/cardano-web3-js/blob/main/src/providers/kupmios/index.ts#L189)

#### Parameters

##### tx

`string`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`CW3Types.Provider.submitTx`
