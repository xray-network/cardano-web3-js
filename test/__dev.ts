import { CardanoWeb3, Account } from "../src"
import { testData } from "./__test"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const data = await web3.provider.getUtxosByAddresses([
    "addr1q9acqkgp6ah0xl6dt6gxtrmj8ee4ehnzfeq9rcuwrldalfsl94rky7hgymnt04zzmn696ksga7526ycypga0p0q5scfquhr65g",
  ])
  console.log(data)
}

app()