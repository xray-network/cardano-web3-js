[cardano-web3-js](../index.md) / CardanoWeb3

# Class: CardanoWeb3

Defined in: [core/cw3.ts:27](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L27)

CardanoWeb3 class
Main class for CardanoWeb3 library which provides all the necessary functions to interact with Cardano blockchain

## Constructors

### Constructor

> **new CardanoWeb3**(`config?`): `CardanoWeb3`

Defined in: [core/cw3.ts:42](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L42)

Initialize CardanoWeb3 library

#### Parameters

##### config?

[`InitConfig`](../cardano-web3-js/namespaces/CW3Types/type-aliases/InitConfig.md)

Configuration object

#### Returns

`CardanoWeb3`

CardanoWeb3 instance

## Properties

### \_\_config

> **\_\_config**: `object`

Defined in: [core/cw3.ts:30](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L30)

#### network

> **network**: [`NetworkConfig`](../cardano-web3-js/namespaces/CW3Types/type-aliases/NetworkConfig.md)

#### protocolParams

> **protocolParams**: [`ProtocolParameters`](../cardano-web3-js/namespaces/CW3Types/type-aliases/ProtocolParameters.md)

#### slotConfig

> **slotConfig**: [`SlotConfig`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SlotConfig.md)

#### ttl

> **ttl**: `number`

***

### account

> **account**: `object`

Defined in: [core/cw3.ts:104](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L104)

#### fromAddress()

> **fromAddress**: (`address`) => [`Account`](Account.md)

Create a new account from address

##### Parameters

###### address

`string`

Bech32 address

##### Returns

[`Account`](Account.md)

Account instance

#### fromConnector()

> **fromConnector**: (`connector`) => `Promise`\<[`Account`](Account.md)\>

Create new account from wallet connector

##### Parameters

###### connector

[`Connector`](Connector.md)

Connector instance

##### Returns

`Promise`\<[`Account`](Account.md)\>

Account instance

#### fromMnemonic()

> **fromMnemonic**: (`mnemonic`, `password?`, `accountPath`, `addressPath`) => [`Account`](Account.md)

Create new account from mnemonic

##### Parameters

###### mnemonic

`string`

Mnemonic

###### password?

`string`

###### accountPath?

[`AccountDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDerivationPath.md) = `DEFAULT_ACCOUNT_DERIVATION_PATH`

Account derivation path

###### addressPath?

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Address derivation path

##### Returns

[`Account`](Account.md)

Account instance

#### fromXprvKey()

> **fromXprvKey**: (`xprvKey`, `password?`, `accountPath`, `addressPath`) => [`Account`](Account.md)

Create new account from xprv key

##### Parameters

###### xprvKey

`string`

Extended private key

###### password?

`string`

###### accountPath?

[`AccountDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountDerivationPath.md) = `DEFAULT_ACCOUNT_DERIVATION_PATH`

Account derivation path (optioanl, default: [1852, 1815, 0])

###### addressPath?

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Address derivation path (optional, default: [0, 0])

##### Returns

[`Account`](Account.md)

Account instance

#### fromXpubKey()

> **fromXpubKey**: (`xpubKey`, `addressPath`) => [`Account`](Account.md)

Create new account from xpub key

##### Parameters

###### xpubKey

`string`

Extended public key

###### addressPath

[`AddressDerivationPath`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AddressDerivationPath.md) = `DEFAULT_ADDRESS_DERIVATION_PATH`

Known Address derivation path (optional, default: [0, 0])

##### Returns

[`Account`](Account.md)

Account instance

#### importAccount()

> **importAccount**: (`config`) => [`Account`](Account.md)

Import account from JSON config

##### Parameters

###### config

[`AccountExportV1`](../cardano-web3-js/namespaces/CW3Types/type-aliases/AccountExportV1.md)

Account export config

##### Returns

[`Account`](Account.md)

Account instance

***

### connector

> **connector**: `object`

Defined in: [core/cw3.ts:75](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L75)

#### init()

> **init**: (`wallet`, `extensions?`) => `Promise`\<[`Connector`](Connector.md)\>

Initialize wallet connector

##### Parameters

###### wallet

`string`

Wallet name

###### extensions?

`any`

Wallet extensions

##### Returns

`Promise`\<[`Connector`](Connector.md)\>

Wallet connector instance

#### isEnabled()

> **isEnabled**: (`wallet`) => `Promise`\<`boolean`\>

Check if wallet connector is enabled

##### Parameters

###### wallet

`string`

Wallet name

##### Returns

`Promise`\<`boolean`\>

True if wallet is enabled, false otherwise

#### list()

> **list**: () => `Promise`\<`string`[]\>

List available wallet connectors

##### Returns

`Promise`\<`string`[]\>

List of available connectors in window object

***

### explorers

> **explorers**: [`Explorers`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Explorers.md)

Defined in: [core/cw3.ts:29](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L29)

***

### message

> **message**: `object`

Defined in: [core/cw3.ts:228](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L228)

#### signWithAccount()

> **signWithAccount**: (`account`, `message`, `password?`) => `Promise`\<[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)\>

Sign message with account private key

##### Parameters

###### account

[`Account`](Account.md)

Account instance

###### message

`string`

Message to sign

###### password?

`string`

Password for xprv key (optional)

##### Returns

`Promise`\<[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)\>

Signed message

#### signWithVrfKey()

> **signWithVrfKey**: (`verificationKey`, `address`, `message`) => [`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

Sign message with payment key

##### Parameters

###### verificationKey

`string`

Payment key

###### address

`string`

Payment address

###### message

`string`

Message to sign

##### Returns

[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

Signed message

#### verify()

> **verify**: (`address`, `message`, `signedMessage`) => `boolean`

Verify signed message

##### Parameters

###### address

`string`

Payment address

###### message

`string`

Message to verify

###### signedMessage

[`SignedMessage`](../cardano-web3-js/namespaces/CW3Types/type-aliases/SignedMessage.md)

Signed message

##### Returns

`boolean`

True if message is verified, false otherwise

***

### provider

> **provider**: [`Provider`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Provider.md)

Defined in: [core/cw3.ts:28](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L28)

## Methods

### createTx()

> **createTx**(): `TxBuilder`

Defined in: [core/cw3.ts:187](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L187)

Generate new transaction builder

#### Returns

`TxBuilder`

Transaction builder instance

***

### importTx()

> **importTx**(`tx`): `TxFinalizer`

Defined in: [core/cw3.ts:196](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L196)

Import transaction from CBOR string

#### Parameters

##### tx

`string`

Transaction JSON

#### Returns

`TxFinalizer`

Transaction finalizer instance

***

### observeTx()

> **observeTx**(`txHash`, `checkInterval`, `maxTime`): `Promise`\<`boolean`\>

Defined in: [core/cw3.ts:224](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L224)

Observe transaction

#### Parameters

##### txHash

`string`

Transaction hash

##### checkInterval

`number`

Check interval in ms

##### maxTime

`number`

Maximum time to wait in ms

#### Returns

`Promise`\<`boolean`\>

Transaction status (boolean)

***

### submitTx()

> **submitTx**(`tx`): `Promise`\<`string`\>

Defined in: [core/cw3.ts:213](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L213)

Submit transaction to blockchain

#### Parameters

##### tx

`string`

CBOR encoded transaction

#### Returns

`Promise`\<`string`\>

Transaction hash

***

### tip()

> **tip**(): `Promise`\<[`Tip`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Tip.md)\>

Defined in: [core/cw3.ts:204](https://github.com/xray-network/cardano-web3-js/blob/main/src/core/cw3.ts#L204)

Get current tip

#### Returns

`Promise`\<[`Tip`](../cardano-web3-js/namespaces/CW3Types/type-aliases/Tip.md)\>

Current tip object
