import Crypto from './crypto'
import Explorer from './explorer'
import Contract from './contract'
import packageInfo from '../package.json'

const CardanoWeb3 = function CardanoWeb3(settings = {}) {
  this.version = packageInfo.version
  this.initialized = false
  this.settings = {
    crypto: {
      protocolParams: {
        linearFeeCoefficient: '44',
        linearFeeConstant: '155381',
        minimumUtxoVal: '1000000',
        poolDeposit: '500000000',
        keyDeposit: '2000000',
      },
      harden: 0x80000000,
      ttl: 7200,
      ...settings.crypto,
    },
    explorer: {
      ...settings.explorer,
    },
    contract: {
      ...settings.contract,
    },
  }

  const tmpProviders = []

  this.addProvider = function provider(name, Provider) {
    if (this.initialized) {
      this[name] = new Provider(this)
    } else {
      tmpProviders.push({
        name,
        Provider,
      })
    }
  }

  this.init = async () => {
    this.crypto = await new Crypto(this, this.settings.crypto)
    if (this.settings.explorer.url) {
      this.explorer = new Explorer(this, this.settings.explorer)
    }
    if (this.settings.contract.url) {
      this.contract = new Contract(this, this.settings.contract)
    }
    this.initialized = true
    tmpProviders.forEach((i) => {
      this[i.name] = new i.Provider(this)
    })

    return this
  }

  return this
}

CardanoWeb3.version = packageInfo.version

if (typeof window === 'object') {
  if (!window.CardanoWeb3) {
    window.CardanoWeb3 = CardanoWeb3
  }
}

export default CardanoWeb3
