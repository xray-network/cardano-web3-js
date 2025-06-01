# Smart Contracts Transactions

Smart contracts have a more complex threshold of entry for the developer, this information will help you collect transactions with scripts (smart contracts), sign and send them to the network. The benefit of CW3js automates some of the build steps so you don't have to think about them.

## Pay to address with data

```ts
import { CardanoWeb3, Data } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const MyDatumSchema = web3.Data.Object({
  myVariableA: web3.Data.Bytes(),
  myVariableB: web3.Data.Nullable(web3.Data.Integer()),
})
type MyDatum = Data.Static<typeof MyDatumSchema>
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
  .setChangeAddress(account.__config.paymentAddress)
  .addOutputs(
    [
      {
        address:
          "addr1...",
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
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

## Deposit to contract

```ts
import { CardanoWeb3, T } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const alwaysSucceedScript: T.Script = {
  language: "PlutusV2",
  script: "480100002221200101",
}
const datum = web3.Data.void()
const scriptAddress = utils.script.scriptToAddress(alwaysSucceedScript) // detect address by script, you can pass known

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
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
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```

## Collect from contract

```ts
import { CardanoWeb3 } from "cardano-web3-js"

const web3 = new CardanoWeb3()
const account = web3.account.fromXprvKey("xprv...")
const state = await account.getState()

const scriptAddress = utils.script.scriptToAddress(alwaysSucceedScript)
const utxos = await web3.provider.getUtxosByAddress(scriptAddress)
const utxoRef = utxos.find((utxo) => utxo.scriptHash) // find referene utxo for script reference input
const utxoToCollect = utxos.find((utxo) => utxo.datumType === "inline" && !utxo.scriptHash) // utxo to collect, pass known
const emptyRedeemer = web3.Data.void()

const tx_build = await web3
  .createTx()
  .setChangeAddress(account.__config.paymentAddress)
  .addInputs(state.utxos)
  // .attachScript(alwaysSucceedScript) // not nedeed, if the script is loaded from readFrom UTXO
  .readFrom([utxoRef!])
  .collectFrom([utxoToCollect!], emptyRedeemer)
  .applyAndBuild()

const tx_signed = await tx_build.signWithAccount(account).applyAndToJson()
console.log(tx_signed)

const submitted_hash = await tx_build
  .signWithAccount(account)
  .applyAndSubmit()
console.log(submitted_hash)
```