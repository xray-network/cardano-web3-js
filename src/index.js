const version = require('../package.json').version

const Crypto = require('./crypto')
const Network = require('./network')
const Contract = require('./contract')

const RayWeb3 = function (args = {}) {
  this.version = version
  this.crypto = new Crypto(this, args.protocolParams, args.network, args.cryptoErrorHandler)
  this.network = new Network(this, args.provider, args.networkErrorHandler)
  this.contract = new Contract(this, args.contractErrorHandler)
}

RayWeb3.version = version

module.exports = RayWeb3

const web3 = new RayWeb3({
  provider: 'https://graphql.rraayy.com/',
})

window.web3 = web3

setTimeout(() => {
  // const mnemonic = web3.crypto.generateMmenonic()
  // const user = web3.crypto.getAccountKeys(mnemonic)
  // console.log('keys', user)
  const pubkey =
    'xpub1vze98ylt8jpjdt63r9gnvp7spgjfgh8lnn3jw57rlhlttx202sck7hn0e9wtg0u4v2gyfl5vnp945zsd5psx5fa6xue4n6pnkdufssgzhej8y'
  const addresses = web3.crypto.getAccountAddresses(pubkey, 'external')
  console.log('addresses', addresses)
}, 1000)
