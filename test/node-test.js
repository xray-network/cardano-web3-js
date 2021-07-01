const CardanoWeb3 = require('../src/index')

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