import { expect, it, describe } from "vitest"
import { CardanoWeb3, PlutusData, CW3Types, utils } from "@"
import { testData } from "./__test"

describe("Governance", async () => {
  const web3 = new CardanoWeb3({
    network: "preview",
  })
  const account = web3.account.fromXprvKey(testData.xprvKey)
  const changeAddress = account.__config.paymentAddress
  const stakingAddress = account.__config.stakingAddress
  const accountState = await account.getState()
  const accountUtxos = accountState.utxos

  it("Delegate to DRep (AlwaysAbstain)", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.delegateToDRep(stakingAddress, "AlwaysAbstain")
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Delegate to DRep (AlwaysNoConfidence)", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.delegateToDRep(stakingAddress, "AlwaysNoConfidence")
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Delegate to DRep", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.delegateToDRep(stakingAddress, "drep1yf4darz2mwutsy5j966e6unjrd4f4s56e8eh3hekzvq3grcrzn4ws")
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Register DRep", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.registerDRep(stakingAddress)
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Update DRep", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.updateDRep(stakingAddress)
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Deregister DRep", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .governance.deregisterDRep(stakingAddress)
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })
})
