# cardano-web3.js
Cardano Web3 JavaScript Library with Crypto, Explorer, Websockets, Contract, Connector modules

Demo: https://ray-network.github.io/cardano-web3.js/

```
🚀 SDK development is in progress and still in alpha. Not recommended for use in production
```

# API Reference

### To Do
— [x] MVP
— [ ] Production Version
— [ ] Types
— [ ] Tests

### Initialization (Simple Demo)
```JS
// see /publish/ folder for browser, nodejs, asmjs versions
// see /test/ folder for examples
import CardanoWeb3 from "../cardano-web3-browser"

const Cardano = new CardanoWeb3({
  crypto: {
    network: "testnet",
  },
  explorer: {
    url: "https://graphql-api.mainnet.dandelion.link",
  },
})

Cardano.init().then(() => {
    console.log(Cardano.crypto) // Cardano cryptography module
    console.log(Cardano.explorer) // Blockchain data explorer module

  async function getAccountState() {
    const mnemonic = await Cardano.crypto.generateMnemonic()
    const { privateKey, publicKey } = await Cardano.crypto.getAccountKeys(mnemonic)
    const { assets, transactions, utxos } = await Cardano.explorer.getAccountStateByPublicKey(publicKey, 25, 10, [0, 1]) // will fecth 10 times by 25 addresse internal and external ([0, 1]) addresses

    console.log('accountBalance', assets)
    console.log('accountTransactions', transactions)
    console.log('accountUtxos', utxos)
  }
  
  getAccountState()
})
```

### Lib state
```JS
Cardano.version // lib version
Cardano.initialized // init state
Cardano.settings // protocol params
```

### Crypto (Working with Cardano Crypto Entities)
```JS
Cardano.crypto.Cardano // 'cardano-serialization-lib' object
Cardano.crypto.Bech32 // 'bech32' object
Cardano.crypto.Bip39 // 'bip39-ligh' object
Cardano.crypto.BigNumber // 'bignumber.js' object
Cardano.crypto.Network // current network (testnet | mainnet)
Cardano.crypto.Utils // useful utils for working with Cardano crypto
Cardano.crypto.generateMnemonic() // generate 24 word mnemonic
Cardano.crypto.validateMnemonic(mnemonic) // validate mnemonic
Cardano.crypto.validateAddress(address) // returns type of address (shelley, byron) or false
Cardano.crypto.getAccountKeys(mnemonic) // { privateKey, publicKey, rewardAddress, accountId, accountIdFull }
Cardano.crypto.getAccountAddresses(pubKey, pageSize, [addressTypes], shift) // [] with addresses types [0] internal, [1] external, [0, 1] for both
Cardano.crypto.generatePolicyForPubkey(pubKey) // return { script, policyId } for single issuer
Cardano.crypto.txBuildMint(toAddress, tokensToMint, utxos, currentSlot, metadata, donate) // build mint tx (will send all utxos)
Cardano.crypto.txBuildAll(toAddress, utxos, currentSlot, metadata) // send all utxos
Cardano.crypto.txBuild(outputs, utxos, changeAddress, currentSlot, metadata, certificates, withdrawals, allowNoOutputs) // pick needed utxos and send to outputs (can be multipe)
Cardano.crypto.txSign(transaction, privateKey, script) // pass built tx and private key, and scripts if needed
Cardano.crypto.generateDelegationCerts(pubKey, hasKey, poolId) // generate delegation & registration certificate (if it does not exist)
Cardano.crypto.generateDeregistrationCerts(pubKey) // generate deregistration certificate
...
```

### Explorer (Cardano-graphql Query Wrappers)
```JS
Cardano.explorer.query(query) // axios post proxy
Cardano.explorer.getNetworkInfo() // network info
Cardano.explorer.getAccountStateByPublicKey(pubKey, pageSize, maxShiftIndex, [addressTypes]) // returns { assets, transactions, utxos } by fetching pubKey derived addresses by {pageSize} count with max {maxShiftIndex} iterations ('soft' fetching of large data pieces), addresses types [0] internal, [1] external, [0, 1] for both
Cardano.explorer.txSend(transaction) // send build transaction (hex format)
...
```

### Websockets (Ogmios Interactions)
```JS
...
```

### Contract (Smart Contracts Interactions)
```JS
...
```

### Connector (Web3 Events & Listeners)
```JS
...
```