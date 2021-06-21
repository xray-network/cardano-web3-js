const version = require('../package.json').version

const Crypto = require('./crypto')
const Network = require('./network')
const Contract = require('./contract')

const CardanoWeb3 = function (args = {}) {
  this.version = version
  return (async () => {
    this.crypto = await new Crypto(this, args.protocolParams, args.network, args.cryptoErrorHandler)
    this.network = new Network(this, args.provider, args.networkErrorHandler)
    this.contract = new Contract(this, args.contractErrorHandler)
    return this
  })()
}

CardanoWeb3.version = version

module.exports = CardanoWeb3
