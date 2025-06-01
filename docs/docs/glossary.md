# Glossary

## Additional References
For more detailed information, you can refer to the following resources. These definitions should give you a quick overview of each term in the Cardano ecosystem.

* [Cardano Documentation](https://docs.cardano.org/)
* [Official Cardano Glossary](https://www.essentialcardano.io/glossary)
* [Understanding Cardano Wallets](https://docs.cardano.org/about-cardano/new-to-cardano/types-of-wallets/)
* [Cardano Plutus](https://developers.cardano.org/docs/smart-contracts/plutus/)

## Definitions

### xprvKey
A master extended private key used in Cardano wallets to derive child private keys and addresses. It is the root of a hierarchical deterministic (HD) wallet, allowing for the generation of multiple accounts and addresses while maintaining security.

### vrfKey
Already derived from xprvKey verification key of the account (address) used to sign transactions in Cardano. It is used to verify the authenticity of messages and transactions, ensuring that they originate from the owner of the corresponding private key.

### xpubKey
An extended public key derived from an xprvKey, which can generate multiple child public keys and addresses without revealing the private keys. It is used to receive funds and verify transactions.

### Wallet
A software application or hardware device that stores private keys and interacts with blockchain networks to send, receive, and manage cryptocurrencies.

### Account
A digital identity within the blockchain that holds information about balances, transaction history, and other relevant data.

### Mnemonic
A sequence of words used to generate a cryptographic key, providing a human-readable way to back up and restore a cryptocurrency wallet.

### Private Key
A secret cryptographic key that allows a user to access and manage their cryptocurrency. It must be kept confidential.

### Public Key
A cryptographic key derived from a private key that can be shared publicly. It is used to receive funds and verify digital signatures.

### Payment Address
An address used to receive cryptocurrency payments. It is derived from a public key.

### Staking Address
A special type of address in Cardano used to participate in the staking process and earn rewards by delegating to a stake pool.

### Script (Smart Contract)
A piece of code deployed on the blockchain that automatically executes predefined actions when certain conditions are met.

### Address Derivation
The process of generating multiple unique addresses from a single seed or master key using hierarchical deterministic (HD) wallets.

### Plutus
Cardano’s smart contract platform that allows developers to write and deploy decentralized applications (DApps) using the Haskell programming language.

### Message Signing
The process of using a private key to create a digital signature on a message or transaction to prove ownership and ensure integrity.

### Data Provider
An entity or service that supplies blockchain data, such as transaction history, price feeds, and other relevant information.

### Metadata
Additional data included in blockchain transactions that can provide extra information about the transaction, such as descriptions or identifiers.

### NFT (Non-Fungible Token)
A unique digital asset verified using blockchain technology, representing ownership of a specific item or piece of content, such as art or collectibles.

### Tokens
Digital assets created on a blockchain that can represent various utilities or assets, such as cryptocurrencies, loyalty points, or other forms of value.


### Fingerprint
A Cardano token fingerprint is a unique identifier derived from the token's policy ID and asset name, typically encoded in Base58 format to facilitate easy reference and sharing.
