[cardano-web3-js](../index.md) / CardanoWeb3

# Class: CardanoWeb3

CardanoWeb3 class

Main class for CardanoWeb3 library which provides all the necessary functions to interact with Cardano blockchain

## Constructors

### new CardanoWeb3()

> **new CardanoWeb3**(): [`CardanoWeb3`](CardanoWeb3.md)

#### Returns

[`CardanoWeb3`](CardanoWeb3.md)

## Properties

### CML

> **CML**: `__module`

dcSpark @ Cardano Multiplatform Library

#### Defined in

[src/core/cw3.ts:29](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L29)

***

### Constr

> **Constr**: *typeof* [`Constr`](Constr.md)

Lucid Plutus Data Construction Lib

#### Defined in

[src/core/cw3.ts:37](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L37)

***

### Data

> **Data**: `object`

#### Any()

> **Any**: () => `TUnsafe`\<[`Data`](../type-aliases/Data.md)\>

##### Returns

`TUnsafe`\<[`Data`](../type-aliases/Data.md)\>

#### Array()

> **Array**: \<`T`\>(`items`, `options`?) => `TArray`\<`T`\>

##### Type Parameters

• **T** *extends* `TSchema`

##### Parameters

• **items**: `T`

• **options?**

• **options.maxItems?**: `number`

• **options.minItems?**: `number`

• **options.uniqueItems?**: `boolean`

##### Returns

`TArray`\<`T`\>

#### Boolean()

> **Boolean**: () => `TUnsafe`\<`boolean`\>

##### Returns

`TUnsafe`\<`boolean`\>

#### Bytes()

> **Bytes**: (`options`?) => `TUnsafe`\<`string`\>

##### Parameters

• **options?**

• **options.enum?**: `string`[]

• **options.maxLength?**: `number`

• **options.minLength?**: `number`

##### Returns

`TUnsafe`\<`string`\>

#### Enum()

> **Enum**: \<`T`\>(`items`) => `TUnion`\<`T`[]\>

##### Type Parameters

• **T** *extends* `TSchema`

##### Parameters

• **items**: `T`[]

##### Returns

`TUnion`\<`T`[]\>

#### Integer()

> **Integer**: (`options`?) => `TUnsafe`\<`bigint`\>

##### Parameters

• **options?**

• **options.exclusiveMaximum?**: `number`

• **options.exclusiveMinimum?**: `number`

• **options.maximum?**: `number`

• **options.minimum?**: `number`

##### Returns

`TUnsafe`\<`bigint`\>

#### Literal()

> **Literal**: \<`T`\>(`title`) => `TLiteral`\<`T`\>

##### Type Parameters

• **T** *extends* `TLiteralValue`

##### Parameters

• **title**: `T`

##### Returns

`TLiteral`\<`T`\>

#### Map()

> **Map**: \<`T`, `U`\>(`keys`, `values`, `options`?) => `TUnsafe`\<`Map`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>, [`Static`](../namespaces/Data/type-aliases/Static.md)\<`U`, []\>\>\>

##### Type Parameters

• **T** *extends* `TSchema`

• **U** *extends* `TSchema`

##### Parameters

• **keys**: `T`

• **values**: `U`

• **options?**

• **options.maxItems?**: `number`

• **options.minItems?**: `number`

##### Returns

`TUnsafe`\<`Map`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>, [`Static`](../namespaces/Data/type-aliases/Static.md)\<`U`, []\>\>\>

#### Nullable()

> **Nullable**: \<`T`\>(`item`) => `TUnsafe`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>\>

##### Type Parameters

• **T** *extends* `TSchema`

##### Parameters

• **item**: `T`

##### Returns

`TUnsafe`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>\>

#### Object()

> **Object**: \<`T`\>(`properties`, `options`?) => `TObject`\<`T`\>

Object applies by default a PlutusData Constr with index 0.
Set 'hasConstr' to false to serialize Object as PlutusData List.

##### Type Parameters

• **T** *extends* `TProperties`

##### Parameters

• **properties**: `T`

• **options?**

• **options.hasConstr?**: `boolean`

##### Returns

`TObject`\<`T`\>

#### Tuple()

> **Tuple**: \<`T`\>(`items`, `options`?) => `TTuple`\<`T`\>

Tuple is by default a PlutusData List.
Set 'hasConstr' to true to apply a PlutusData Constr with index 0.

##### Type Parameters

• **T** *extends* `TSchema`[]

##### Parameters

• **items**: [`...T[]`]

• **options?**

• **options.hasConstr?**: `boolean`

##### Returns

`TTuple`\<`T`\>

#### castFrom()

> **castFrom**: \<`T`\>(`data`, `type`) => `T`

##### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

##### Parameters

• **data**: [`Data`](../type-aliases/Data.md)

• **type**: `T`

##### Returns

`T`

#### castTo()

> **castTo**: \<`T`\>(`struct`, `type`) => [`Data`](../type-aliases/Data.md)

##### Type Parameters

• **T**

##### Parameters

• **struct**: [`Exact`](../namespaces/T/type-aliases/Exact.md)\<`T`\>

• **type**: `T`

##### Returns

[`Data`](../type-aliases/Data.md)

#### from()

> **from**: \<`T`\>(`raw`, `type`?) => `T`

Convert Cbor encoded data to PlutusData

##### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

##### Parameters

• **raw**: `string`

• **type?**: `T`

##### Returns

`T`

#### fromJson()

> **fromJson**: (`json`) => [`Data`](../type-aliases/Data.md)

Note Constr cannot be used here.
Strings prefixed with '0x' are not UTF-8 encoded.

##### Parameters

• **json**: `any`

##### Returns

[`Data`](../type-aliases/Data.md)

#### to()

> **to**: \<`T`\>(`data`, `type`?) => `string`

Convert PlutusData to Cbor encoded data.
Or apply a shape and convert the provided data struct to Cbor encoded data.

##### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

##### Parameters

• **data**: [`Exact`](../namespaces/T/type-aliases/Exact.md)\<`T`\>

• **type?**: `T`

##### Returns

`string`

#### toJson()

> **toJson**: (`plutusData`) => `any`

Note Constr cannot be used here, also only bytes/integers as Json keys.

##### Parameters

• **plutusData**: [`Data`](../type-aliases/Data.md)

##### Returns

`any`

#### void()

> **void**: () => `string`

##### Returns

`string`

#### Defined in

[src/core/cw3.ts:35](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L35)

***

### MSL

> **MSL**: `__module`

Emurgo @ Message Signing Library

#### Defined in

[src/core/cw3.ts:31](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L31)

***

### Message

> **Message**: `object`

Message Signing/Verification Lib

#### signData()

> **signData**: (`addressHex`, `payload`, `privateKey`) => [`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

##### Parameters

• **addressHex**: `string`

• **payload**: `string`

• **privateKey**: `string`

##### Returns

[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

#### verifyData()

> **verifyData**: (`addressHex`, `keyHash`, `payload`, `signedMessage`) => `boolean`

##### Parameters

• **addressHex**: `string`

• **keyHash**: `string`

• **payload**: `string`

• **signedMessage**: [`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

##### Returns

`boolean`

#### Defined in

[src/core/cw3.ts:39](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L39)

***

### UPLC

> **UPLC**: `__module`

UPLC @ Untyped Plutus Core Library

#### Defined in

[src/core/cw3.ts:33](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L33)

***

### \_\_config

> **\_\_config**: `object`

#### network

> **network**: [`NetworkConfig`](../namespaces/T/type-aliases/NetworkConfig.md)

#### protocolParams

> **protocolParams**: [`ProtocolParameters`](../namespaces/T/type-aliases/ProtocolParameters.md)

#### slotConfig

> **slotConfig**: [`SlotConfig`](../namespaces/T/type-aliases/SlotConfig.md)

#### ttl

> **ttl**: `number`

#### Defined in

[src/core/cw3.ts:43](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L43)

***

### account

> **account**: `object`

#### fromConnector()

> **fromConnector**: (`connector`) => `Promise`\<[`Account`](Account.md)\>

##### Parameters

• **connector**: [`Connector`](Connector.md)

Connector instance

##### Returns

`Promise`\<[`Account`](Account.md)\>

Account instance

#### fromMnemonic()

> **fromMnemonic**: (`mnemonic`, `accountPath`, `addressPath`) => [`Account`](Account.md)

##### Parameters

• **mnemonic**: `string`

Mnemonic

• **accountPath**: [`AccountDerivationPath`](../namespaces/T/type-aliases/AccountDerivationPath.md) = `DEFAULT_ACCOUNT_DERIVATION_PATH`

Account derivation path

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Address derivation path

##### Returns

[`Account`](Account.md)

Account instance

#### fromXprvKey()

> **fromXprvKey**: (`xprvKey`, `accountPath`, `addressPath`) => [`Account`](Account.md)

##### Parameters

• **xprvKey**: `string`

Extended private key

• **accountPath**: [`AccountDerivationPath`](../namespaces/T/type-aliases/AccountDerivationPath.md) = `DEFAULT_ACCOUNT_DERIVATION_PATH`

Account derivation path (optioanl, default: [1852, 1815, 0])

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Address derivation path (optional, default: [0, 0])

##### Returns

[`Account`](Account.md)

Account instance

#### fromXpubKey()

> **fromXpubKey**: (`xpubKey`, `addressPath`) => [`Account`](Account.md)

##### Parameters

• **xpubKey**: `string`

Extended public key

• **addressPath**: [`AddressDerivationPath`](../namespaces/T/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Known Address derivation path (optional, default: [0, 0])

##### Returns

[`Account`](Account.md)

Account instance

#### importAccount()

> **importAccount**: (`config`) => [`Account`](Account.md)

##### Parameters

• **config**: [`AccountExportV1`](../namespaces/T/type-aliases/AccountExportV1.md)

Account export config

##### Returns

[`Account`](Account.md)

Account instance

#### Defined in

[src/core/cw3.ts:124](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L124)

***

### connector

> **connector**: `object`

#### init()

> **init**: (`wallet`, `extensions`?) => `Promise`\<[`Connector`](Connector.md)\>

##### Parameters

• **wallet**: `string`

Wallet name

• **extensions?**: `any`

Wallet extensions

##### Returns

`Promise`\<[`Connector`](Connector.md)\>

Wallet connector instance

#### isEnabled()

> **isEnabled**: (`wallet`) => `Promise`\<`string`[]\>

##### Parameters

• **wallet**: `string`

Wallet name

##### Returns

`Promise`\<`string`[]\>

True if wallet is enabled, false otherwise

#### list()

> **list**: () => `Promise`\<`string`[]\>

##### Returns

`Promise`\<`string`[]\>

List of available connectors in window object

#### Defined in

[src/core/cw3.ts:95](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L95)

***

### explorer

> **explorer**: [`Explorer`](../namespaces/T/type-aliases/Explorer.md)

#### Defined in

[src/core/cw3.ts:40](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L40)

***

### provider

> **provider**: [`Provider`](../namespaces/T/type-aliases/Provider.md)

#### Defined in

[src/core/cw3.ts:41](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L41)

***

### utils

> **utils**: `Utils`

#### Defined in

[src/core/cw3.ts:42](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L42)

## Methods

### createNativeScript()

> **createNativeScript**(`json`): `object`

Generate new Natice Script for token minting

#### Parameters

• **json**: [`NativeConfig`](../namespaces/T/type-aliases/NativeConfig.md)

Native token config

#### Returns

`object`

Native token instance

##### policyId

> **policyId**: `string`

##### script

> **script**: [`Script`](../namespaces/T/type-aliases/Script.md)

#### Defined in

[src/core/cw3.ts:243](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L243)

***

### createTx()

> **createTx**(): `TxBuilder`

Generate new transaction builder

#### Returns

`TxBuilder`

Transaction builder instance

#### Defined in

[src/core/cw3.ts:196](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L196)

***

### importTx()

> **importTx**(`tx`): `TxFinalizer`

Import transaction from CBOR string

#### Parameters

• **tx**: `string`

Transaction JSON

#### Returns

`TxFinalizer`

Transaction finalizer instance

#### Defined in

[src/core/cw3.ts:205](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L205)

***

### observeTx()

> **observeTx**(`txHash`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

Observe transaction

#### Parameters

• **txHash**: `string`

Transaction hash

• **checkInterval**: `number`

Check interval in ms

• **maxTime**: `number`

Maximum time to wait in ms

#### Returns

`Promise`\<`boolean`\>

Transaction status (boolean)

#### Defined in

[src/core/cw3.ts:225](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L225)

***

### signMessageWithAccount()

> **signMessageWithAccount**(`account`, `message`, `password`?): `Promise`\<[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)\>

Sign message with account private key

#### Parameters

• **account**: [`Account`](Account.md)

Account instance

• **message**: `string`

Message to sign

• **password?**: `string`

Password for xprv key (optional)

#### Returns

`Promise`\<[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)\>

Signed message

#### Defined in

[src/core/cw3.ts:254](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L254)

***

### signMessageWithVrfKey()

> **signMessageWithVrfKey**(`verificationKey`, `address`, `message`): [`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

Sign message with payment key

#### Parameters

• **verificationKey**: `string`

Payment key

• **address**: `string`

Payment address

• **message**: `string`

Message to sign

#### Returns

[`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

Signed message

#### Defined in

[src/core/cw3.ts:289](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L289)

***

### submitAndObserveTx()

> **submitAndObserveTx**(`tx`): `Promise`\<`boolean`\>

Submit and observe transaction

#### Parameters

• **tx**: `string`

CBOR encoded transaction

#### Returns

`Promise`\<`boolean`\>

Transaction status (boolean)

#### Defined in

[src/core/cw3.ts:234](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L234)

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Submit transaction to blockchain

#### Parameters

• **tx**: `string`

CBOR encoded transaction

#### Returns

`Promise`\<`string`\>

Transaction hash

#### Defined in

[src/core/cw3.ts:214](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L214)

***

### tip()

> **tip**(): `Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

Get current tip

#### Returns

`Promise`\<[`Tip`](../namespaces/T/type-aliases/Tip.md)\>

Current tip object

#### Defined in

[src/core/cw3.ts:318](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L318)

***

### verifyMessage()

> **verifyMessage**(`address`, `message`, `signedMessage`): `boolean`

Verify signed message

#### Parameters

• **address**: `string`

Payment address

• **message**: `string`

Message to verify

• **signedMessage**: [`SignedMessage`](../namespaces/T/type-aliases/SignedMessage.md)

Signed message

#### Returns

`boolean`

True if message is verified, false otherwise

#### Defined in

[src/core/cw3.ts:305](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L305)

***

### init()

> `static` **init**(`config`?): `Promise`\<[`CardanoWeb3`](CardanoWeb3.md)\>

Initialize CardanoWeb3 library

#### Parameters

• **config?**: [`InitConfig`](../namespaces/T/type-aliases/InitConfig.md)

Configuration object

#### Returns

`Promise`\<[`CardanoWeb3`](CardanoWeb3.md)\>

CardanoWeb3 instance

#### Defined in

[src/core/cw3.ts:55](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/core/cw3.ts#L55)
