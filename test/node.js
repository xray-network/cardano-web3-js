const CardanoWeb3 = require('../publish/cardano-web3-nodejs')

const Cardano = new CardanoWeb3({
  crypto: {
    network: 'mainnet',
  },
  explorer: {
    url: 'https://graphql.rraayy.com',
  },
})

Cardano.init().then(() => {
  console.log(Cardano.crypto.generateMnemonic())
})