# Advanced Usage

This section will tell you how to create Native Script, Plutus Data, or sign and verify a message

## Plutus Data

```ts
import { PlutusData, PlutusConstr, utils } from "cardano-web3-js"

const datum = PlutusData.to(new PlutusConstr(0, [utils.misc.fromStringToHex("Hello, World!")]))

console.log(datum)
```

## Plutus Data (with Type Builder)

```ts
import { PlutusData, PlutusConstr } from "cardano-web3-js"

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

console.log(datum)
```

