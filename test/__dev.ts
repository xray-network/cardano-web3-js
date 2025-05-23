import { CardanoWeb3 } from "@"
import { testData } from "./__test"

const app = async () => {
  const web3 = new CardanoWeb3()
  const data = await web3.tip()
  console.log(data)
}

app()
