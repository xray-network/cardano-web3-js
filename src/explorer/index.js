import axios from 'axios'

const Explorer = function Explorer(pkg, settings) {
  const Cardano = pkg
  const { BigNumber } = Cardano.crypto

  const responseHandler = settings.responseHandler || ((response) => response)
  const errorHandler = settings.errorHandler || ((error) => error)

  const client = axios.create({
    baseURL: settings.url,
    headers: { ...settings.headers },
  })

  client.interceptors.response.use(
    (response) => {
      return responseHandler(response)
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
      limit: 100,
      maxPages: 100,
      offset: 0,
      query: () => '',
      variables: {},
      ...params,
    }

    // objects deep concat

    const objectDeepMerge = (a, b) => {
      const ret = Object.keys(a).length === 0 ? b : a
      Object.keys(b).forEach((prop) => {
        const propA = a[prop]
        const propB = b[prop]

        if (typeof propA === typeof propB && typeof propA === 'object') {
          if (Array.isArray(propA)) {
            ret[prop] = propA.concat(propB)
          } else {
            ret[prop] = objectDeepMerge(propA, propB)
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
      response = objectDeepMerge(response, update)
      if (update.data.errors) {
        return
      }
      iteration += 1
      const totalCount = Number(update?.data?.data[config.aggregateString]?.aggregate?.count)
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
    type = [0],
  ) => {
    // generate address pack and get addresses utxos with addressing paths

    async function checkAddressesUTXO(checkType, checkPageSize, checkShift) {
      const tmpAddresses = await Cardano.crypto.getAccountAddresses(
        publicKey,
        checkPageSize,
        checkType,
        checkShift,
      )

      const checkedAdresses = tmpAddresses.map((addr) => addr.address)
      const {
        data: { data: tmpAddresssesUTXO },
      } = await Cardano.explorer.getAddressesUTXO(checkedAdresses)

      const adressesWithUTXOs = tmpAddresssesUTXO.utxos
        ? tmpAddresssesUTXO.utxos.map((utxo) => {
          const filteredUtxo = tmpAddresses.filter((addr) => addr.address === utxo.address)[0]
          return {
            ...utxo,
            addressing: {
              type: filteredUtxo.type,
              path: filteredUtxo.path,
            },
          }
        })
        : []

      return [adressesWithUTXOs, checkedAdresses]
    }


    // get transactions by hashes and transform to readable object

    async function getTransactions(addressesArray) {

      const getTxHashFromInputs = await Cardano.explorer.getTxHashFromInputs(addressesArray)
      const getTxHashFromOutputs = await Cardano.explorer.getTxHashFromOutputs(addressesArray)
      const rawTransactions = [
        ...(getTxHashFromInputs?.data?.data?.transactions || []),
        ...(getTxHashFromOutputs?.data?.data?.transactions || []),
      ]

      const getTxByHash = await Cardano.explorer.getTxByHash(rawTransactions.map((tx) => tx.hash))
      const transactions = (getTxByHash?.data?.data?.transactions || []).map((tx) => {
        // let inputAmount = new BigNumber(0)
        // let outputAmount = new BigNumber(0)
        let amount = new BigNumber(0)
        const tokens = {}

        tx.inputs.forEach((input) => {
          if (input && addressesArray.includes(input.address)) {
            amount = amount.minus(input.value)
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
          if (output && addressesArray.includes(output.address)) {
            amount = amount.plus(output.value)
            output.tokens.forEach((token) => {
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
                quantity: new BigNumber(tokens[assetId].quantity).plus(quantity),
              }
            })
          }
        })

        return {
          ...tx,
          type: new BigNumber(amount).lt(0) ? 'send' : 'receive',
          value: new BigNumber(amount).abs(),
          tokens: Object.keys(tokens).map((key) => {
            return {
              ...tokens[key],
              quantity: tokens[key].quantity.abs(),
            }
          }),
        }
      })

      return transactions
    }

    // check addresses utxos with shift until next pack will be with zero utxos

    const utxos = []
    const transactions = []

    async function checkAddressesUTXOWithShift(checkType, checkPageSize, checkShift) {
      const [adressesWithUTXOs, checkedAdresses] = await checkAddressesUTXO(
        checkType,
        checkPageSize,
        checkShift,
      )

      const txs = await getTransactions(checkedAdresses)
      transactions.push(...txs)

      if (checkShift <= maxShiftIndex) {
        if (adressesWithUTXOs.length) {
          utxos.push(...adressesWithUTXOs)
          checkShift += 1
          await checkAddressesUTXOWithShift(checkType, checkPageSize, checkShift)
        }
      }
    }

    await checkAddressesUTXOWithShift(type, pageSize, 0)

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

export default Explorer
