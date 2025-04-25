import { CardanoWeb3, KupmiosProvider, Account } from "../src"
import { testData } from "./__test"

const app = async () => {
  const web3 = await CardanoWeb3.init()
  // const web3 = await CardanoWeb3.init({
  //   provider: new KupmiosProvider({
  //     ogmiosUrl: "https://graph.xray.app/output/ogmios/mainnet/api/v1",
  //     kupoUrl: "https://graph.xray.app/output/kupo/mainnet/api/v1",
  //     kupoHeaders: {
  //       "Authorization": "Bearer YOUR_API_KEY",
  //     }
  //   })
  // })

  const data = await web3.provider.getTip()
  console.log(data)

  // const data = await web3.provider.getProtocolParameters()
  // console.log(data)

  // const data = await web3.provider.getUtxosByAddresses(["addr1q9acqkgp6ah0xl6dt6gxtrmj8ee4ehnzfeq9rcuwrldalfsl94rky7hgymnt04zzmn696ksga7526ycypga0p0q5scfquhr65g"])
  // console.log(data)

  // const data = await web3.provider.getUtxoByOutputRef("f144a8264acf4bdfe2e1241170969c930d64ab6b0996a4a45237b623f1dd670e", 0)
  // console.log(data)

  // const data = await web3.provider.resolveUtxosDatumAndScript()
  // console.log(data)

  // const data = await web3.provider.getDatumByHash("818ee3db3bbbd04f9f2ce21778cac3ac605802a4fcb00c8b3a58ee2dafc17d46")
  // console.log(data)

  // const data = await web3.provider.getScriptByHash("bd2119ee2bfb8c8d7c427e8af3c35d537534281e09e23013bca5b138")
  // console.log(data)

  // const data = await web3.provider.getDelegation("stake1uy0j63mz0t5zde4h63pdeazatgywl29dzvzq5whshs2gvysvl8c90")
  // console.log(data)

  // const data = await web3.provider.evaluateTx(
  //   "83a4008182582000000000000000000000000000000000000000000000000000000000000000000001828258390101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011a001e84808258390102020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202021a0078175c021a0001faa403191e46a1008182582001000000000000000000000000000000000000000000000000000000000000005840d7af60ae33d2af351411c1445c79590526990bfa73cbb3732b54ef322daa142e6884023410f8be3c16e9bd52076f2bb36bf38dfe034a9f04658e9f56197ab80ff6"
  // )
  // console.log(data)

  // const data = await web3.provider.submitTx(
  //   "83a4008182582000000000000000000000000000000000000000000000000000000000000000000001828258390101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101010101011a001e84808258390102020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202020202021a0078175c021a0001faa403191e46a1008182582001000000000000000000000000000000000000000000000000000000000000005840d7af60ae33d2af351411c1445c79590526990bfa73cbb3732b54ef322daa142e6884023410f8be3c16e9bd52076f2bb36bf38dfe034a9f04658e9f56197ab80ff6"
  // )
  // console.log(data)

  // const data = await web3.provider.observeTx("f144a8264acf4bdfe2e1241170969c930d64ab6b0996a4a45237b623f1dd670e")
  // console.log(data)
}

app()
