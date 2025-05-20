[cardano-web3-js](../index.md) / Message

# Function: Message()

> **Message**(): `object`

Defined in: utils/libs/message/index.ts:14

## Returns

`object`

### signData()

> **signData**: (`addressHex`, `payload`, `privateKey`) => [`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

#### Parameters

##### addressHex

`string`

##### payload

`string`

##### privateKey

`string`

#### Returns

[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

### verifyData()

> **verifyData**: (`addressHex`, `keyHash`, `payload`, `signedMessage`) => `boolean`

#### Parameters

##### addressHex

`string`

##### keyHash

`string`

##### payload

`string`

##### signedMessage

[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

#### Returns

`boolean`
