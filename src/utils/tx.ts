import { CML, CW3Types } from "@"
import { fromHex } from "./misc"
import { getShelleyOrByronAddress, getCredentials } from "./address"
import { scriptToScriptRef } from "./script"

export const createCostModels = (costModels: CW3Types.CostModels): CML.CostModels => {
  return CML.CostModels.from_json(
    JSON.stringify({
      0: costModels.PlutusV1,
      1: costModels.PlutusV2,
      2: costModels.PlutusV3,
    })
  )
}

export const getTxBuilder = (protocolParams: CW3Types.ProtocolParameters): CML.TransactionBuilder => {
  const pp = protocolParams
  const txBuilderConfig = CML.TransactionBuilderConfigBuilder.new()
    .fee_algo(CML.LinearFee.new(BigInt(pp.minFeeA), BigInt(pp.minFeeB), BigInt(pp.minFeeRefScriptCostPerByte)))
    .pool_deposit(BigInt(pp.poolDeposit))
    .key_deposit(BigInt(pp.keyDeposit))
    .coins_per_utxo_byte(BigInt(pp.coinsPerUtxoByte))
    .max_tx_size(pp.maxTxSize)
    .max_value_size(pp.maxValSize)
    .collateral_percentage(pp.collateralPercentage)
    .max_collateral_inputs(pp.maxCollateralInputs)
    .ex_unit_prices(
      CML.ExUnitPrices.new(
        CML.Rational.new(BigInt(pp.priceMem * 100_000_000), 100_000_000n),
        CML.Rational.new(BigInt(pp.priceStep * 100_000_000), 100_000_000n)
      )
    )
    .prefer_pure_change(true)
    .cost_models(createCostModels(pp.costModels))
    .build()

  return CML.TransactionBuilder.new(txBuilderConfig)
}

export const assetsToValue = (value?: CW3Types.Value, assets?: CW3Types.Asset[]): CML.Value => {
  const multiAsset = CML.MultiAsset.new()

  if (assets) {
    for (const asset of assets) {
      const policyId = CML.ScriptHash.from_hex(asset.policyId)
      const assetName = CML.AssetName.from_raw_bytes(fromHex(asset.assetName || ""))
      const policyAssets = multiAsset.get_assets(policyId) ?? CML.MapAssetNameToCoin.new()
      policyAssets.insert(assetName, asset.quantity)
      multiAsset.insert_assets(policyId, policyAssets)
    }
  }

  return CML.Value.new(value || 0n, multiAsset)
}

export const utxoToCore = (utxo: CW3Types.Utxo): CML.TransactionUnspentOutput => {
  return CML.TransactionUnspentOutput.new(utxoToTransactionInput(utxo), utxoToTransactionOutput(utxo))
}

export const utxoToTransactionInput = (utxo: CW3Types.Utxo): CML.TransactionInput => {
  return CML.TransactionInput.new(CML.TransactionHash.from_hex(utxo.transaction.id), BigInt(utxo.index))
}

export const utxoToTransactionOutput = (utxo: CW3Types.Utxo): CML.TransactionOutput => {
  const value = assetsToValue(utxo.value, utxo.assets)
  const outputBuilder = outputToTransactionOutputBuilder(
    {
      address: utxo.address,
      value: utxo.value,
      assets: utxo.assets,
    },
    utxo.datum
      ? {
          type: utxo.datumType,
          datum: utxo.datum,
        }
      : undefined,
    utxo.script || undefined
  )
  return outputBuilder.next().with_value(value).build().output()
}

export const outputToTransactionOutputBuilder = (
  output: CW3Types.Output,
  datum?: CW3Types.DatumOutput,
  script?: CW3Types.Script
): CML.TransactionOutputBuilder => {
  const address = getShelleyOrByronAddress(output.address)
  let outputBuilder = CML.TransactionOutputBuilder.new().with_address(address)
  if (datum) {
    if (datum.type === "inline") {
      const data = CML.PlutusData.from_cbor_hex(datum.datum)
      const datumOption = CML.DatumOption.new_datum(data)
      outputBuilder = outputBuilder.with_data(datumOption)
    }
    if (datum.type === "hash") {
      // TODO: Check if hash datums is set correctly in the UTXO (witness set)
      const data = CML.PlutusData.from_cbor_hex(datum.datum)
      outputBuilder = outputBuilder.with_communication_data(data)
    }
  }
  return script ? outputBuilder.with_reference_script(scriptToScriptRef(script)) : outputBuilder
}

export const discoverOwnUsedTxKeyHashes = (
  tx: CML.Transaction,
  ownKeyHashes: string[],
  ownUtxos: CW3Types.Utxo[]
): string[] => {
  const usedKeyHashes: string[] = []
  const body = tx.body()
  const inputs = body.inputs()
  const collaterals = body.collateral_inputs()
  const certs = body.certs()
  const withdrawals = body.withdrawals()
  const signers = body.required_signers()
  const scripts = tx.witness_set().native_scripts()

  if (inputs && inputs.len() > 0) {
    for (let i = 0; i < inputs.len(); i++) {
      const input = inputs.get(i)
      const txId = input.transaction_id().to_hex()
      const txIndex = Number(input.index())
      const utxo = ownUtxos.find((utxo) => utxo.transaction.id === txId && utxo.index === txIndex)
      if (utxo) {
        const { paymentCred } = getCredentials(utxo.address)
        usedKeyHashes.push(paymentCred.hash)
      }
    }
  }

  if (collaterals && collaterals.len() > 0) {
    for (let i = 0; i < collaterals.len(); i++) {
      const input = collaterals.get(i)
      const txId = input.transaction_id().to_hex()
      const txIndex = Number(input.index())
      const utxo = ownUtxos.find((utxo) => utxo.transaction.id === txId && utxo.index === txIndex)
      if (utxo) {
        const { paymentCred } = getCredentials(utxo.address)
        usedKeyHashes.push(paymentCred.hash)
      }
    }
  }

  if (certs && certs.len() > 0) {
    for (let i = 0; i < certs.len(); i++) {
      const cert = certs.get(i)
      switch (cert.kind()) {
        case 0:
          // Not needed for registration
          break
        case 1: {
          const credential = cert.as_stake_deregistration()?.stake_credential()
          if (credential?.kind() === 0) {
            usedKeyHashes.push(credential.as_pub_key()?.to_hex())
          }
          if (credential?.kind() === 0) {
            usedKeyHashes.push(credential.as_script()?.to_hex())
          }
          break
        }
        case 2: {
          const credential = cert.as_stake_delegation()?.stake_credential()
          if (credential?.kind() === 0) {
            usedKeyHashes.push(credential.as_pub_key()?.to_hex())
          }
          if (credential?.kind() === 1) {
            usedKeyHashes.push(credential.as_script()?.to_hex())
          }
          break
        }
        case 3: {
          const poolParams = cert.as_pool_registration()?.pool_params()!
          const owners = poolParams?.pool_owners()
          if (!owners) break
          for (let i = 0; i < owners.len(); i++) {
            const keyHash = owners.get(i).to_hex()
            usedKeyHashes.push(keyHash)
          }
          const operator = poolParams.operator().to_hex()
          usedKeyHashes.push(operator)
          break
        }
        case 4: {
          const operator = cert.as_pool_retirement()?.pool().to_hex()
          usedKeyHashes.push(operator)
          break
        }
        case 6: {
          const credential = cert.as_unreg_cert()?.stake_credential()
          if (credential) {
            usedKeyHashes.push(credential.to_cbor_hex())
          }
          break
        }

        default:
          break
      }
    }
  }

  if (withdrawals && withdrawals.len() > 0) {
    const rewardAddresses = withdrawals.keys()
    for (let i = 0; i < rewardAddresses.len(); i++) {
      const credential = rewardAddresses.get(i).payment()
      if (credential.kind() === 0) {
        usedKeyHashes.push(credential.as_pub_key()?.to_hex())
      }
      if (credential.kind() === 1) {
        usedKeyHashes.push(credential.as_script()?.to_hex())
      }
    }
  }

  if (signers && signers.len() > 0) {
    for (let i = 0; i < signers.len(); i++) {
      usedKeyHashes.push(signers.get(i).to_hex())
    }
  }

  function keyHashFromScript(scripts: CML.NativeScriptList) {
    for (let i = 0; i < scripts.len(); i++) {
      const script = scripts.get(i)
      if (script.kind() === 0) {
        const keyHash = script.as_script_pubkey()?.ed25519_key_hash().to_hex()
        usedKeyHashes.push(keyHash)
      }
      if (script.kind() === 1) {
        keyHashFromScript(script.as_script_all()!.native_scripts())
        return
      }
      if (script.kind() === 2) {
        keyHashFromScript(script.as_script_any()!.native_scripts())
        return
      }
      if (script.kind() === 3) {
        keyHashFromScript(script.as_script_n_of_k()!.native_scripts())
        return
      }
    }
  }
  if (scripts && scripts.len() > 0) keyHashFromScript(scripts)

  return usedKeyHashes.filter((hash) => ownKeyHashes.includes(hash))
}
