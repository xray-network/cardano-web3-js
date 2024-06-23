import { expect, it, describe } from "vitest"
import { CardanoWeb3, KupmiosProvider, T } from "../src"
import { testData } from "./__test"

describe("TX", async () => {
  const web3 = await CardanoWeb3.init()
  const account = web3.account.fromXprvKey(testData.xprvKey)
  const changeAddress = account.__config.paymentAddress
  const stakingAddress = account.__config.stakingAddress
  await account.updateState()
  const alwaysSucceedScript: T.Script = {
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
      .addInputs(account.__state.utxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account)
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
    const MyDatumSchema = web3.Data.Object({
      myVariableA: web3.Data.Bytes(),
      myVariableB: web3.Data.Nullable(web3.Data.Integer()),
    })
    type MyDatum = T.Data.Static<typeof MyDatumSchema>
    const MyDatum = MyDatumSchema as unknown as MyDatum
    const datum = web3.Data.to(
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
      .addInputs(account.__state.utxos)
      .applyAndBuild()

    const tx_signed = await tx_build
      .signWithAccount(account)
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
    const datum = web3.Data.void()
    const scriptAddress = web3.utils.script.scriptToAddress(alwaysSucceedScript)

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(account.__state.utxos)
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

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Collect from contract", async () => {
    const scriptAddress = web3.utils.script.scriptToAddress(alwaysSucceedScript)
    const utxos = await web3.provider.getUtxosByAddress(scriptAddress)
    const utxoRef = utxos.find((utxo) => utxo.scriptHash)
    const utxoToCollect = utxos.find((utxo) => utxo.datumType === "inline" && !utxo.scriptHash)
    const emptyRedeemer = web3.Data.void()

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress)
      .addInputs(account.__state.utxos)
      // .attachScript(alwaysSucceedScript) // not nedeed, if the script is loaded from readFrom UTXO
      .readFrom([utxoRef!])
      .collectFrom([utxoToCollect!], emptyRedeemer)
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Mint token and add metadata", async () => {
    const { paymentCred } = account.__config // or get from address with web3.utils.address.getCredentials("addr1...").paymentCred.hash
    const { policyId, script } = web3.utils.script.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCred },
        {
          type: "before",
          slot: web3.utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
        },
      ],
    })

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress) // will be sent to this address, or addInputs() with newly minted token
      .addInputs(account.__state.utxos)
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

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })

  it("Burn token", async () => {
    const { paymentCred } = account.__config // or get from address with web3.utils.address.getCredentials("addr1...").paymentCred.hash
    const { policyId, script } = web3.utils.script.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCred },
        {
          type: "before",
          slot: web3.utils.time.unixTimeToSlot(1759168016669), // 1759168016669 = Mon Sep 29 2025 17:46:56 GMT+0000
        },
      ],
    })

    const tx_build = await web3
      .createTx()
      .setChangeAddress(changeAddress) // will be sent to this address, or addInputs() with newly minted token
      .addInputs(account.__state.utxos)
      .attachScript(script)
      .addMint([
        {
          policyId: policyId,
          assetName: "Bitcoin",
          quantity: -500n, // Poor developer bought a villa
        },
      ])
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
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
      .addInputs(account.__state.utxos)
      .registerStake(stakingAddress!)
      // .delegateTo("pool1pn9sffcqqzkx70m0gujks4h3wf8p4y706t2f0cjcyreekg83wtf") // you can also use delegate stake in one TX
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
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
      .addInputs(account.__state.utxos)
      .delegateTo(stakingAddress!, "pool1pn9sffcqqzkx70m0gujks4h3wf8p4y706t2f0cjcyreekg83wtf")
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
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
      .addInputs(account.__state.utxos)
      .withdrawRewards(stakingAddress!, 0n) // 0n for testing, you must use exact amount of existing rewards to withdraw
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
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
      .addInputs(account.__state.utxos)
      .deregisterStake(stakingAddress!)
      .applyAndBuild()

    const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
    // console.log(tx_signed)

    // const submitted_hash = await tx_build
    //   .signWithAccount(account)
    //   .applyAndSubmit()
    // console.log(submitted_hash)

    expect(tx_signed).haveOwnProperty("tx")
  })
})
