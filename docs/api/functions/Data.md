[cardano-web3-js](../index.md) / Data

# Function: Data()

> **Data**(`cw3`): `object`

## Parameters

• **cw3**: [`CardanoWeb3`](../classes/CardanoWeb3.md)

## Returns

`object`

### Any()

> **Any**: () => `TUnsafe`\<[`Data`](../type-aliases/Data.md)\>

#### Returns

`TUnsafe`\<[`Data`](../type-aliases/Data.md)\>

### Array()

> **Array**: \<`T`\>(`items`, `options`?) => `TArray`\<`T`\>

#### Type Parameters

• **T** *extends* `TSchema`

#### Parameters

• **items**: `T`

• **options?**

• **options.maxItems?**: `number`

• **options.minItems?**: `number`

• **options.uniqueItems?**: `boolean`

#### Returns

`TArray`\<`T`\>

### Boolean()

> **Boolean**: () => `TUnsafe`\<`boolean`\>

#### Returns

`TUnsafe`\<`boolean`\>

### Bytes()

> **Bytes**: (`options`?) => `TUnsafe`\<`string`\>

#### Parameters

• **options?**

• **options.enum?**: `string`[]

• **options.maxLength?**: `number`

• **options.minLength?**: `number`

#### Returns

`TUnsafe`\<`string`\>

### Enum()

> **Enum**: \<`T`\>(`items`) => `TUnion`\<`T`[]\>

#### Type Parameters

• **T** *extends* `TSchema`

#### Parameters

• **items**: `T`[]

#### Returns

`TUnion`\<`T`[]\>

### Integer()

> **Integer**: (`options`?) => `TUnsafe`\<`bigint`\>

#### Parameters

• **options?**

• **options.exclusiveMaximum?**: `number`

• **options.exclusiveMinimum?**: `number`

• **options.maximum?**: `number`

• **options.minimum?**: `number`

#### Returns

`TUnsafe`\<`bigint`\>

### Literal()

> **Literal**: \<`T`\>(`title`) => `TLiteral`\<`T`\>

#### Type Parameters

• **T** *extends* `TLiteralValue`

#### Parameters

• **title**: `T`

#### Returns

`TLiteral`\<`T`\>

### Map()

> **Map**: \<`T`, `U`\>(`keys`, `values`, `options`?) => `TUnsafe`\<`Map`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>, [`Static`](../namespaces/Data/type-aliases/Static.md)\<`U`, []\>\>\>

#### Type Parameters

• **T** *extends* `TSchema`

• **U** *extends* `TSchema`

#### Parameters

• **keys**: `T`

• **values**: `U`

• **options?**

• **options.maxItems?**: `number`

• **options.minItems?**: `number`

#### Returns

`TUnsafe`\<`Map`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>, [`Static`](../namespaces/Data/type-aliases/Static.md)\<`U`, []\>\>\>

### Nullable()

> **Nullable**: \<`T`\>(`item`) => `TUnsafe`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>\>

#### Type Parameters

• **T** *extends* `TSchema`

#### Parameters

• **item**: `T`

#### Returns

`TUnsafe`\<[`Static`](../namespaces/Data/type-aliases/Static.md)\<`T`, []\>\>

### Object()

> **Object**: \<`T`\>(`properties`, `options`?) => `TObject`\<`T`\>

Object applies by default a PlutusData Constr with index 0.
Set 'hasConstr' to false to serialize Object as PlutusData List.

#### Type Parameters

• **T** *extends* `TProperties`

#### Parameters

• **properties**: `T`

• **options?**

• **options.hasConstr?**: `boolean`

#### Returns

`TObject`\<`T`\>

### Tuple()

> **Tuple**: \<`T`\>(`items`, `options`?) => `TTuple`\<`T`\>

Tuple is by default a PlutusData List.
Set 'hasConstr' to true to apply a PlutusData Constr with index 0.

#### Type Parameters

• **T** *extends* `TSchema`[]

#### Parameters

• **items**: [`...T[]`]

• **options?**

• **options.hasConstr?**: `boolean`

#### Returns

`TTuple`\<`T`\>

### castFrom()

> **castFrom**: \<`T`\>(`data`, `type`) => `T`

#### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

#### Parameters

• **data**: [`Data`](../type-aliases/Data.md)

• **type**: `T`

#### Returns

`T`

### castTo()

> **castTo**: \<`T`\>(`struct`, `type`) => [`Data`](../type-aliases/Data.md)

#### Type Parameters

• **T**

#### Parameters

• **struct**: [`Exact`](../namespaces/T/type-aliases/Exact.md)\<`T`\>

• **type**: `T`

#### Returns

[`Data`](../type-aliases/Data.md)

### from()

> **from**: \<`T`\>(`raw`, `type`?) => `T`

Convert Cbor encoded data to PlutusData

#### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

#### Parameters

• **raw**: `string`

• **type?**: `T`

#### Returns

`T`

### fromJson()

> **fromJson**: (`json`) => [`Data`](../type-aliases/Data.md)

Note Constr cannot be used here.
Strings prefixed with '0x' are not UTF-8 encoded.

#### Parameters

• **json**: `any`

#### Returns

[`Data`](../type-aliases/Data.md)

### to()

> **to**: \<`T`\>(`data`, `type`?) => `string`

Convert PlutusData to Cbor encoded data.
Or apply a shape and convert the provided data struct to Cbor encoded data.

#### Type Parameters

• **T** = [`Data`](../type-aliases/Data.md)

#### Parameters

• **data**: [`Exact`](../namespaces/T/type-aliases/Exact.md)\<`T`\>

• **type?**: `T`

#### Returns

`string`

### toJson()

> **toJson**: (`plutusData`) => `any`

Note Constr cannot be used here, also only bytes/integers as Json keys.

#### Parameters

• **plutusData**: [`Data`](../type-aliases/Data.md)

#### Returns

`any`

### void()

> **void**: () => `string`

#### Returns

`string`

## Defined in

[src/utils/data/index.ts:31](https://github.com/xray-network/cardano-web3-js/blob/51359f53a33988f2d248eab0454f4ef69063970a/src/utils/data/index.ts#L31)
