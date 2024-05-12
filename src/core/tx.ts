import { DEFAULT_PROTOCOL_PARAMETERS } from "../config"
import * as T from "../types"

export class Tx {
  private account: T.Account
  private cw3: T.CardanoWeb3
  __txBuilder: T.C.TransactionBuilder

  static init = async (cw3: T.CardanoWeb3, account?: T.Account) => {
    throw new Error("Not implemented: CreateTx")
    // const tx = new Tx()
    // tx.cw3 = cw3
    // const protocolParameters = cw3?.remoteProtocolParams
    //   ? await cw3.provider.getProtocolParameters()
    //   : DEFAULT_PROTOCOL_PARAMETERS
    // const txBuilderConfig = await getTxBuilderConfig(cw3.C, protocolParameters)
    // tx.__txBuilder = tx.cw3.C.TransactionBuilder.new(txBuilderConfig)
    // if (account) tx.account = account
    // return tx
  }

  // addInputs = () => {
  //   return this
  // }

  // addOutputs = () => {
  //   return this
  // }

  // setTtl = () => {
  //   return this
  // }

  // addCertificates = () => {
  //   return this
  // }

  // addRewardWithdrawals = () => {
  //   return this
  // }

  // addMetadata = () => {
  //   return this
  // }

  // addMint = () => {
  //   return this
  // }

  // addReferenceInput = () => {
  //   return this
  // }

  // addChangeAddress = () => {
  //   return this
  // }

  // addCollateralReturn = () => {
  //   return this
  // }

  // addRequiredSigner = () => {
  //   return this
  // }

  // evaluate = () => {
  //   return this
  // }

  // build = () => {
  //   return this
  // }

  // sign = async () => {
  //   return this
  // }

  // submit = async () => {
  //   return this
  // }
}

const getTxBuilderConfig = async (C: T.C, pp: T.ProtocolParameters) => {
  const createCostModels = (costModels: T.CostModels) => {
    const models = C.CostModels.new()
    const plutusV1 = C.IntList.new()
    const plutusV2 = C.IntList.new()
    costModels["PlutusV1"].forEach((value) => plutusV1.add(C.Int.new(BigInt(value))))
    costModels["PlutusV2"].forEach((value) => plutusV2.add(C.Int.new(BigInt(value))))
    models.set_plutus_v1(plutusV1)
    models.set_plutus_v2(plutusV2)
    return models
  }

  return C.TransactionBuilderConfigBuilder.new()
    .fee_algo(C.LinearFee.new(BigInt(pp.minFeeA), BigInt(pp.minFeeA)))
    .pool_deposit(BigInt(pp.poolDeposit))
    .key_deposit(BigInt(pp.keyDeposit))
    .coins_per_utxo_byte(BigInt(pp.coinsPerUtxoByte))
    .max_tx_size(pp.maxTxSize)
    .max_value_size(pp.maxValSize)
    .collateral_percentage(pp.collateralPercentage)
    .max_collateral_inputs(pp.maxCollateralInputs)
    .ex_unit_prices(
      C.ExUnitPrices.new(
        C.Rational.new(BigInt(pp.priceMem * 100_000_000), 100_000_000n),
        C.Rational.new(BigInt(pp.priceStep * 100_000_000), 100_000_000n)
      )
    )
    .prefer_pure_change(true)
    .cost_models(createCostModels(pp.costModels))
    .build()
}
