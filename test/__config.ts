import { CardanoWeb3, T } from "../src"

export const testData = {
  mnemonic:
    "tennis song tackle neither wire grass hold bulk harsh extra globe trigger huge swamp protect script maple trick spend blush pattern erosion fan usual",
  xpubKey:
    "xpub14jpy5tpjgcg88f83a3y8ad8khh5egsw2vtnlmpsu6h6auq5hmnkrrz6lw03pun96ye6yt94kcr32w899dnlcrjatl53gzcxy05ht78gatef2q",
  xprvKey:
    "xprv1yz7m0z04hnyujef2vrzpqycgm5x6v3py7p5hvnl5py8k83p2a3dh0y6rxgkajr6vuv66gyxmte63ark5kjwj5f7mdm50rfds7fgxam75j5h86mmf3tz92lau8wa2u6qfvqq0gva27qlsaxx4gseuyjsfny72dutj",
  accountPath: [1852, 1815, 0] as T.AccountDerivationPath,
  addressPath: [0, 0] as T.AddressDerivationPath,
  checksumId: "KHZE-9936",
  checksumImage:
    "7c44f408d3f4c07ae6826a16eb7acc2d49b08043350763d1f689ac1fbcfc8709aed77d7d3b13a01be9a81b25aaf1c30cb3f526f772596b0fd23f2a10b113258b",
  paymentAddress:
    "addr1qxpm2aqmn48he8dtp9p8hk9gtew6cypy6ra3mgs8xkn86qmd3vtjzheq22w8mmfhm8agpmywnlu2rsxgkdrctv7mcc3s9anhjz",
  paymentAddressEnterprise: "addr1vxpm2aqmn48he8dtp9p8hk9gtew6cypy6ra3mgs8xkn86qchyvh02",
  paymentCred: "83b5741b9d4f7c9dab09427bd8a85e5dac1024d0fb1da20735a67d03",
  paymentAddressVerificationKey:
    "ed25519e_sk1hqjj77328jfu6g0qygjkpucuw236l3maz8a6glr0k9dmm4p2a3dc4umg55au94q3umzkylcjrzplzhx7kkw977t6mgmhss8t2vmernqrw6sz0",
  stakingAddress: "stake1u9kck9eptus998raa5man75qaj8fl79pcrytx3u9k0duvgcwajtd3",
  stakingCred: "6d8b17215f20529c7ded37d9fa80ec8e9ff8a1c0c8b34785b3dbc623",
  poolId: "1c8cd022e993a8366be641c17cb6d9c5d8944e00bfce3189d8b1515a", // XRAY Pool
  accountState: {
    utxos: [
      {
        transaction: {
          id: "503d38fbfe5d0e8a18b69c1e7b12034ccc08cbcb03cb6fa905f6db96a1ba398f",
        },
        index: 0,
        address:
          "addr1qxpm2aqmn48he8dtp9p8hk9gtew6cypy6ra3mgs8xkn86qmd3vtjzheq22w8mmfhm8agpmywnlu2rsxgkdrctv7mcc3s9anhjz",
        value: 5_000_000_000n, // Dummy 5K ADA
        assets: [
          {
            policyId: "8bca871dcd4f1dd9588d901d02677b6d2413fd19e4c8febfc353edff",
            assetName: "5045505041",
            quantity: 1_000n, // Dummy 1K Test Token
          },
        ],
        datumHash: null,
        datumType: null,
        scriptHash: null,
        datum: null,
        script: null,
      },
    ],
    balance: { lovelace: 5_000_000_000n, assets: [] }, // Dummy 5K ADA
    delegation: null,
    rewards: 10_000_000n, // Dumnmy 10 ADA
  },
}
