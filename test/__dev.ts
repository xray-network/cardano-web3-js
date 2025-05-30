import { CardanoWeb3, utils } from "@"
import { testData } from "./__test"

const app = async () => {
  const web3 = new CardanoWeb3()
  const data = await web3.getTip()
  console.log(data)
}

app()
