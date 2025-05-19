import { CardanoWeb3, KupmiosProvider, Account } from "../src"
import { testData } from "./__test"

const app = async () => {
  const web3 = new CardanoWeb3()

  const data = await web3.provider.getProtocolParameters()
  console.log(data)
}

app()
