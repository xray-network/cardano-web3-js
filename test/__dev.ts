import { CardanoWeb3, utils } from "@"
import { testData } from "./__test"

const app = async () => {
  const web3 = new CardanoWeb3()
  const data = await web3.tip()
  console.log(data)
  console.log(utils.keys.mnemonicToXprvKey("check sketch include already elder vague sister dove pool sugar badge real visual devote cross attract title nut slogan flag text ignore stock mushroom"))
}

app()
