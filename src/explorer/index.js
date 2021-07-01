const axios = require('axios')

const Explorer = function Explorer(pkg, settings) {
  const Cardano = pkg
  const { BigNumber } = Cardano.crypto

  const errorHandler =
    settings.errorHandler ||
    ((error) => {
      return error.response
        ? error.response.data
        : {
            errors: [
              {
                name: error.name,
                message: error.message,
              },
            ],
          }
    })

  const client = axios.create({
    baseURL: settings.url,
    headers: { ...settings.headers },
  })

  client.interceptors.response.use(
    (response) => {
      return response?.data
    },
    (error) => {
      return errorHandler(error)
    },
  )

  this.query = (query) => {
    return client.post('/', query)
  }

  this.getNetworkInfo = () => {
    return client.post('/', {
      query: `
        {
          cardano {
            tip {
              number
              slotNo
            }
            currentEpoch {
              number
              startedAt
              blocksCount
            }
          }
        }
      `,
    })
  }

  this.fetchComplete = async (params) => {
    // init config

    const config = {
      aggregateString: '',
      limit: 2500,
      maxPages: 100,
      offset: 0,
      query: () => '',
      variables: {},
      ...params,
    }

    // objects deep concat

    const arraysDeepMerge = (a, b) => {
      const ret = Object.keys(a).length === 0 ? b : a
      Object.keys(b).forEach((prop) => {
        const propA = a[prop]
        const propB = b[prop]

        if (typeof propA === typeof propB && typeof propA === 'object') {
          if (Array.isArray(propA)) {
            ret[prop] = propA.concat(propB)
          } else {
            ret[prop] = arraysDeepMerge(propA, propB)
          }
        } else if (propB) {
          ret[prop] = propB
        }
      })
      return ret
    }

    let response = {}
    let iteration = 0
    async function mergeDeep() {
      const update = await client.post('/', {
        query: config.query(
          config.aggregateString,
          config.limit,
          iteration * config.limit + config.offset,
        ),
        variables: config.variables,
      })
      response = arraysDeepMerge(response, update)
      if (update.errors) {
        return
      }
      iteration += 1
      const totalCount = Number(update.data[config.aggregateString].aggregate.count)
      const currentPage = iteration * config.limit + config.offset
      const limitReason = iteration < config.maxPages
      if (currentPage < totalCount && limitReason) {
        await mergeDeep()
      }
    }
    await mergeDeep()

    return response
  }

  this.getPoolsIds = () => {
    const query = (aggregateString, limit, offset) => `
      query stakePools {
        ${aggregateString} {
          aggregate {
            count
          }
        }
        stakePools (
          limit: ${limit},
          offset: ${offset}
        ) {
          id
        }
      }`

    return this.fetchComplete({
      aggregateString: 'stakePools_aggregate',
      query,
    })
  }

  this.getAddressesUTXO = (addresses) => {
    const query = (aggregateString, limit, offset) => `
      query getAddressesUTXO($addresses: [String]) {
        ${aggregateString}(where: { address: { _in: $addresses } }) {
          aggregate {
            count
          }
        }
        utxos(
          limit: ${limit},
          offset: ${offset},
          where: { address: { _in: $addresses } }
        ) {
          transaction {
            hash
          }
          address
          value
          index
          tokens {
            quantity
            asset {
              assetId
              assetName
              description
              fingerprint
              logo
              name
              ticker
              url
              policyId
            }
          }
        }
      }
    `

    return this.fetchComplete({
      aggregateString: 'utxos_aggregate',
      query,
      variables: {
        addresses,
      },
    })
  }

  this.getTxHashFromInputs = (addresses) => {
    const query = (aggregateString, limit, offset) => `
        query getTxsByInputs($addresses: [String]) {
          ${aggregateString}(
            where: {
              inputs: {
                address: {
                  _in: $addresses
                }
              }
            }
          ) {
            aggregate {
              count
            }
          }
          transactions(
            limit: ${limit},
            offset: ${offset},
            order_by: { includedAt: desc }
            where: {
              inputs: {
                address: {
                  _in: $addresses
                }
              }
            }
          ) {
            fee
            hash
            includedAt
          }
        }
      `

    return this.fetchComplete({
      aggregateString: 'transactions_aggregate',
      query,
      variables: {
        addresses,
      },
    })
  }

  this.getTxHashFromOutputs = (addresses) => {
    const query = (aggregateString, limit, offset) => `
        query getTxsByOutputs($addresses: [String]) {
          ${aggregateString}(
            where: {
              outputs: {
                address: {
                  _in: $addresses
                }
              }
            }
          ) {
            aggregate {
              count
            }
          }
          transactions(
            limit: ${limit},
            offset: ${offset},
            order_by: { includedAt: desc }
            where: {
              outputs: {
                address: {
                  _in: $addresses
                }
              }
            }
          ) {
            fee
            hash
            includedAt
          }
        }
      `

    return this.fetchComplete({
      aggregateString: 'transactions_aggregate',
      query,
      variables: {
        addresses,
      },
    })
  }

  this.getTxByHash = (hashes) => {
    const query = (aggregateString, limit, offset) => `
        query getTxsInfo($hashes: [Hash32Hex]!) {
          ${aggregateString}(
            where: {
              hash: {
                _in: $hashes
              }
            }
          ) {
            aggregate {
              count
            }
          }
          transactions(
            limit: ${limit},
            offset: ${offset},
            order_by: { includedAt: desc }
            where: {
              hash: {
                _in: $hashes
              }
            }
          ) {
            hash
            includedAt
            fee
            deposit
            withdrawals {
              amount
            }
            inputs {
              address
              value
              tokens {
                quantity
                asset {
                  assetId
                  assetName
                  description
                  fingerprint
                  logo
                  name
                  ticker
                  url
                  policyId
                }
              }
            }
            outputs {
              address
              value
              tokens {
                quantity
                asset {
                  assetId
                  assetName
                  description
                  fingerprint
                  logo
                  name
                  ticker
                  url
                  policyId
                }
              }
            }
          }
        }
      `

    return this.fetchComplete({
      aggregateString: 'transactions_aggregate',
      query,
      variables: {
        hashes,
      },
    })
  }

  this.getAccountStateByPublicKey = async (
    publicKey,
    pageSize = 20,
    maxShiftIndex = 10,
    type = 'all',
  ) => {
    // generate address pack and get addresses utxos with addressing paths

    async function checkAddressesUTXO(checkType, checkPageSize, checkShift) {
      const tmpAddresses = await Cardano.crypto.getAccountAddresses(
        publicKey,
        checkType,
        checkPageSize,
        checkShift,
      )

      const checkedAdresses = tmpAddresses.addresses
      const { data: tmpAddresssesUTXO } = await Cardano.explorer.getAddressesUTXO(checkedAdresses)

      const adressesWithUTXOs = tmpAddresssesUTXO.utxos
        ? tmpAddresssesUTXO.utxos.map((utxo) => {
            return {
              ...utxo,
              addressing: tmpAddresses.paths[utxo.address],
            }
          })
        : []

      return [adressesWithUTXOs, checkedAdresses]
    }

    // check addresses utxos with shift until next pack will be with zero utxos

    const utxos = []
    const adressesArray = []

    async function checkAddressesUTXOWithShift(checkType, checkPageSize, checkShift) {
      const [adressesWithUTXOs, checkedAdresses] = await checkAddressesUTXO(
        checkType,
        checkPageSize,
        checkShift,
      )
      adressesArray.push(...checkedAdresses)
      if (checkShift < maxShiftIndex) {
        if (adressesWithUTXOs.length) {
          checkShift += 1
          utxos.push(...adressesWithUTXOs)
          await checkAddressesUTXOWithShift(checkType, checkPageSize, checkShift)
        }
      }
    }

    await checkAddressesUTXOWithShift(type, pageSize, 0)

    // get transactions by hashes and transform to readable object

    const { data: rawTxInputs } = await Cardano.explorer.getTxHashFromInputs(adressesArray)
    const { data: rawTxOutputs } = await Cardano.explorer.getTxHashFromOutputs(adressesArray)
    const rawTransactions = [
      ...(rawTxInputs?.transactions || []),
      ...(rawTxOutputs?.transactions || []),
    ]

    const { data: transactionsInputsOutputs } = await Cardano.explorer.getTxByHash(
      rawTransactions.map((tx) => tx.hash),
    )

    const transactions = (transactionsInputsOutputs?.transactions || []).map((tx) => {
      let inputAmount = new BigNumber(0)
      let outputAmount = new BigNumber(0)
      const tokens = {}

      tx.inputs.forEach((input) => {
        if (adressesArray.includes(input.address)) {
          inputAmount = inputAmount.plus(input.value)
          input.tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!tokens[assetId]) {
              tokens[assetId] = {
                quantity: new BigNumber(0),
              }
            }
            tokens[assetId] = {
              ...tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(tokens[assetId].quantity).minus(quantity),
            }
          })
        }
      })
      tx.outputs.forEach((output) => {
        if (adressesArray.includes(output.address)) {
          outputAmount = outputAmount.plus(output.value)
          output.tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!tokens[assetId]) {
              tokens[assetId] = {
                quantity: BigInt(0),
              }
            }
            tokens[assetId] = {
              ...tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(tokens[assetId].quantity).plus(quantity),
            }
          })
        }
      })

      return {
        ...tx,
        type: new BigNumber(inputAmount).isZero() ? 'receive' : 'send',
        value: new BigNumber(outputAmount).minus(inputAmount),
        tokens: Object.keys(tokens).map((key) => tokens[key]),
      }
    })

    // get account assets summary from utxos

    const getAssetsSummary = (processAddresses) => {
      const assetsSummary = {
        value: new BigNumber(0),
        tokens: {},
      }

      processAddresses.forEach((addr) => {
        assetsSummary.value = assetsSummary.value.plus(addr.value)
        const { tokens } = addr
        if (tokens.length) {
          tokens.forEach((token) => {
            const { asset, quantity } = token
            const { assetId } = asset
            if (!assetsSummary.tokens[assetId]) {
              assetsSummary.tokens[assetId] = {
                quantity: new BigNumber(0),
              }
            }
            assetsSummary.tokens[assetId] = {
              ...assetsSummary.tokens[assetId],
              ...asset,
              ticker:
                asset.ticker || Buffer.from(asset.assetName || '', 'hex').toString('utf-8') || '?',
              quantity: new BigNumber(assetsSummary.tokens[assetId].quantity).plus(quantity),
            }
          })
        }
      })

      return {
        value: new BigNumber(assetsSummary.value).toFixed(),
        tokens: Object.keys(assetsSummary.tokens).map((key) => assetsSummary.tokens[key]),
      }
    }

    const assets = getAssetsSummary(utxos)

    // return account state object

    return {
      assets,
      transactions,
      utxos,
    }
  }

  this.txSend = (transaction) => {
    return client.post('/', {
      query: `
          mutation submitTransaction($transaction: String!) {
            submitTransaction(transaction: $transaction) {
              hash
            }
          }
         `,
      variables: {
        transaction,
      },
    })
  }
}

module.exports = Explorer
