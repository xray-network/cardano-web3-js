[cardano-web3-js](../index.md) / PlutusData

# Variable: PlutusData

> **PlutusData**: `object`

Defined in: utils/libs/plutusData/index.ts:33

## Type declaration

### Any()

> **Any**: () => `TUnsafe`\<[`PlutusData`](../type-aliases/PlutusData.md)\>

#### Returns

`TUnsafe`\<[`PlutusData`](../type-aliases/PlutusData.md)\>

### Array()

> **Array**: \<`T`\>(`items`, `options?`) => `TArray`\<`T`\>

#### Type Parameters

##### T

`T` *extends* `TSchema`

#### Parameters

##### items

`T`

##### options?

###### maxItems?

`number`

###### minItems?

`number`

###### uniqueItems?

`boolean`

#### Returns

`TArray`\<`T`\>

### Boolean()

> **Boolean**: () => `TUnsafe`\<`boolean`\>

#### Returns

`TUnsafe`\<`boolean`\>

### Bytes()

> **Bytes**: (`options?`) => `TUnsafe`\<`string`\>

#### Parameters

##### options?

###### enum?

`string`[]

###### maxLength?

`number`

###### minLength?

`number`

#### Returns

`TUnsafe`\<`string`\>

### castFrom()

> **castFrom**: \<`T`\>(`data`, `type`) => `T`

#### Type Parameters

##### T

`T` = [`PlutusData`](../type-aliases/PlutusData.md)

#### Parameters

##### data

[`PlutusData`](../type-aliases/PlutusData.md)

##### type

`T`

#### Returns

`T`

### castTo()

> **castTo**: \<`T`\>(`struct`, `type`) => [`PlutusData`](../type-aliases/PlutusData.md)

#### Type Parameters

##### T

`T`

#### Parameters

##### struct

[`Exact`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Exact.md)\<`T`\>

##### type

`T`

#### Returns

[`PlutusData`](../type-aliases/PlutusData.md)

### Enum()

> **Enum**: \<`T`\>(`items`) => `TUnion`\<`T`[]\>

#### Type Parameters

##### T

`T` *extends* `TSchema`

#### Parameters

##### items

`T`[]

#### Returns

`TUnion`\<`T`[]\>

### from()

> **from**: \<`T`\>(`raw`, `type?`) => `T`

Convert Cbor encoded data to PlutusData

Convert Cbor encoded data to Data.
 Or apply a shape and cast the cbor encoded data to a certain type.

#### Type Parameters

##### T

`T` = [`PlutusData`](../type-aliases/PlutusData.md)

#### Parameters

##### raw

`string`

##### type?

`T`

#### Returns

`T`

### fromJson()

> **fromJson**: (`json`) => [`PlutusData`](../type-aliases/PlutusData.md)

Note Constr cannot be used here.
Strings prefixed with '0x' are not UTF-8 encoded.

Note Constr cannot be used here.
Strings prefixed with '0x' are not UTF-8 encoded.

#### Parameters

##### json

`any`

#### Returns

[`PlutusData`](../type-aliases/PlutusData.md)

### Integer()

> **Integer**: (`options?`) => `TUnsafe`\<`bigint`\>

#### Parameters

##### options?

###### exclusiveMaximum?

`number`

###### exclusiveMinimum?

`number`

###### maximum?

`number`

###### minimum?

`number`

#### Returns

`TUnsafe`\<`bigint`\>

### Literal()

> **Literal**: \<`T`\>(`title`) => `TLiteral`\<`T`\>

#### Type Parameters

##### T

`T` *extends* `TLiteralValue`

#### Parameters

##### title

`T`

#### Returns

`TLiteral`\<`T`\>

### Map()

> **Map**: \<`T`, `U`\>(`keys`, `values`, `options?`) => `TUnsafe`\<`Map`\<[`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`T`, \[\]\>, [`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`U`, \[\]\>\>\>

#### Type Parameters

##### T

`T` *extends* `TSchema`

##### U

`U` *extends* `TSchema`

#### Parameters

##### keys

`T`

##### values

`U`

##### options?

###### maxItems?

`number`

###### minItems?

`number`

#### Returns

`TUnsafe`\<`Map`\<[`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`T`, \[\]\>, [`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`U`, \[\]\>\>\>

### Nullable()

> **Nullable**: \<`T`\>(`item`) => `TUnsafe`\<[`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`T`, \[\]\>\>

#### Type Parameters

##### T

`T` *extends* `TSchema`

#### Parameters

##### item

`T`

#### Returns

`TUnsafe`\<[`Static`](../cardano-web3-js/namespaces/PlutusData/type-aliases/Static.md)\<`T`, \[\]\>\>

### Object()

> **Object**: \<`T`\>(`properties`, `options?`) => `TObject`\<`T`\>

Object applies by default a PlutusData Constr with index 0.
Set 'hasConstr' to false to serialize Object as PlutusData List.

#### Type Parameters

##### T

`T` *extends* `TProperties`

#### Parameters

##### properties

`T`

##### options?

###### hasConstr?

`boolean`

#### Returns

`TObject`\<`T`\>

### to()

> **to**: \<`T`\>(`data`, `type?`) => `string`

Convert PlutusData to Cbor encoded data.
Or apply a shape and convert the provided data struct to Cbor encoded data.

Convert PlutusData to Cbor encoded data.
Or apply a shape and convert the provided data struct to Cbor encoded data.

#### Type Parameters

##### T

`T` = [`PlutusData`](../type-aliases/PlutusData.md)

#### Parameters

##### data

[`Exact`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Exact.md)\<`T`\>

##### type?

`T`

#### Returns

`string`

### toJson()

> **toJson**: (`plutusData`) => `any`

Note Constr cannot be used here, also only bytes/integers as Json keys.

Note Constr cannot be used here, also only bytes/integers as Json keys.

#### Parameters

##### plutusData

[`PlutusData`](../type-aliases/PlutusData.md)

#### Returns

`any`

### Tuple()

> **Tuple**: \<`T`\>(`items`, `options?`) => `TTuple`\<`T`\>

Tuple is by default a PlutusData List.
Set 'hasConstr' to true to apply a PlutusData Constr with index 0.

#### Type Parameters

##### T

`T` *extends* `TSchema`[]

#### Parameters

##### items

\[`...T[]`\]

##### options?

###### hasConstr?

`boolean`

#### Returns

`TTuple`\<`T`\>

### void()

> **void**: () => `string`

#### Returns

`string`
