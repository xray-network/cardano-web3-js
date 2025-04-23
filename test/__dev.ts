import { CardanoWeb3, Account } from "../src"
import { testData } from "./__test"

const app = async () => {
  const web3 = await CardanoWeb3.init()

  const data = await web3.provider.getTip()
  console.log(data)
}

app()
