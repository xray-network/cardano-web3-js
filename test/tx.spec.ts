import { expect, it, describe } from "vitest"
import { CardanoWeb3, PlutusData, CW3Types, utils } from "@"
import { testData } from "./__test"

describe("TX", async () => {
  const web3 = new CardanoWeb3({
    network: "preview",
  })
  const account = web3.account.fromXprvKey(testData.xprvKey)
  const changeAddress = account.__config.paymentAddress
  const stakingAddress = account.__config.stakingAddress
  const accountState = await account.getState()
  const accountUtxos = accountState.utxos
  const accountBalance = accountState.balance
  const alwaysSucceedScript: CW3Types.Script = {
    language: "PlutusV2",
    script: "480100002221200101",
  }

  it("Pay to address", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addOutputs([
        {
          address:
            "addr_test1qrnrqg4s73skqfyyj69mzr7clpe8s7ux9t8z6l55x2f2xuqra34p9pswlrq86nq63hna7p4vkrcrxznqslkta9eqs2nsmlqvnk",
          value: 2_000_000n,
          // assets: [
          //   {
          //     policyId: "...policyId...",
          //     assetName: "...assetNameHex...",
          //     quantity: 100n,
          //   },
          // ]
        },
      ])
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Pay to address with data", async () => {
    const MyDatumSchema = PlutusData.Object({
      myVariableA: PlutusData.Bytes(),
      myVariableB: PlutusData.Nullable(PlutusData.Integer()),
    })
    type MyDatum = PlutusData.Static<typeof MyDatumSchema>
    const MyDatum = MyDatumSchema as unknown as MyDatum
    const datum = PlutusData.to(
      {
        myVariableA: "313131",
        myVariableB: 5555n,
      },
      MyDatum
    )

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addOutputs(
        [
          {
            address:
              "addr_test1qrnrqg4s73skqfyyj69mzr7clpe8s7ux9t8z6l55x2f2xuqra34p9pswlrq86nq63hna7p4vkrcrxznqslkta9eqs2nsmlqvnk",
            value: 2_000_000n,
          },
        ],
        {
          type: "inline",
          datum: datum,
        }
      )
      .addInputs(accountUtxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account, accountUtxos)
      // .signWithVrfKey(testData.paymentAddressVerificationKey) // or with payment address verification key
      .applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Deposit to contract", async () => {
    const datum = PlutusData.void()
    const scriptAddress = utils.script.scriptToAddress(alwaysSucceedScript, web3.__config.network.id)

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .payToContract(
        {
          address: scriptAddress,
          value: 1_000_000n,
        },
        {
          type: "inline",
          datum: datum,
        }
      )
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Collect from contract", async () => {
    const scriptAddress = utils.script.scriptToAddress(alwaysSucceedScript, web3.__config.network.id)
    const utxos = await web3.provider.getUtxosByAddress(scriptAddress)
    const utxoRef = utxos.find((utxo) => utxo.scriptHash)
    const utxoToCollect = utxos.find((utxo) => utxo.datumType === "inline" && !utxo.scriptHash)
    const emptyRedeemer = PlutusData.void()

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .attachScript(alwaysSucceedScript) // not nedeed, if the script is loaded from readFrom UTXO
      .readFrom([utxoRef!])
      .collectFrom([utxoToCollect!], emptyRedeemer)
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Mint token and add metadata", async () => {
    const { paymentCred } = account.__config // or get from address with utils.address.getCredentials("addr1...").paymentCred.hash
    const { policyId, script } = utils.script.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCred },
        {
          type: "before",
          slot: utils.time.unixTimeToSlot(1759168016669, web3.__config.slotConfig), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
        },
      ],
    })

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress) // will be sent to this address, or addInputs() with newly minted token
      .addInputs(accountUtxos)
      .attachScript(script)
      .addMetadataJson(
        721, // NFT label
        {
          mintedTo: "Poor developer",
          for: "buying a villa",
        }
      )
      .addMint([
        {
          policyId: policyId,
          assetName: "Bitcoin",
          quantity: 1000n, // Is 1000 bitcoins enough for a poor developer?
        },
      ])
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Burn token", async () => {
    const { paymentCred } = account.__config // or get from address with utils.address.getCredentials("addr1...").paymentCred.hash
    const { policyId, script } = utils.script.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCred },
        {
          type: "before",
          slot: utils.time.unixTimeToSlot(1759168016669, web3.__config.slotConfig), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
        },
      ],
    })

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress) // will be sent to this address, or addInputs() with newly minted token
      .addInputs(accountUtxos)
      .attachScript(script)
      .addMint([
        {
          policyId: policyId,
          assetName: "Bitcoin",
          quantity: -500n, // Poor developer bought a villa
        },
      ])
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Register stake", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .stake.register(stakingAddress!)
      // .delegateTo("pool1pn9sffcqqzkx70m0gujks4h3wf8p4y706t2f0cjcyreekg83wtf") // you can also use delegate stake in one TX
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Delegate to", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .stake.delegateTo(stakingAddress!, "pool1pn9sffcqqzkx70m0gujks4h3wf8p4y706t2f0cjcyreekg83wtf")
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Reward withdrawal", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .stake.withdrawRewards(stakingAddress!, 0n) // 0n for testing, you must use exact amount of existing rewards to withdraw
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Deregister stake", async () => {
    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(accountUtxos)
      .stake.deregister(stakingAddress!)
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account, accountUtxos).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })
})
