import { CardanoWeb3, CW3Types } from "../src"

// Preview Network
export const testData = {
  mnemonic:
    "simple nation hedgehog vapor helmet split plate tomato picture polar sure oak notice ramp scrub mechanic afford door furnace gate build drop manual silk",
  xpubKey:
    "xpub1nyyqpaq3hgsqzzmw8hzz5qgjw3z22uypxn0z7afhucww4r2de6r576k36sufu06wz42l8s3f2pul5g9dq83hx8fn92usvdaerp8mjtqyusz8e",
  xprvKey:
    "xprv1mqxe3f9anrqpuwh80nypu5twu7m0fryp834p49es3x5wyln5heyys5lt2ezl2v4dsdc4uxeacfm0ugj2nj4jcjt9vjtjv8emnrv3ek0ksr9mfp82hzza3zfu8h30gmr9rxa6std89kmyylf2y55c0xmytsld3s4n",
  accountPath: [1852, 1815, 0] as CW3Types.AccountDerivationPath,
  addressPath: [0, 0] as CW3Types.AddressDerivationPath,
  checksumId: "DXLZ-4647",
  checksumImage:
    "ebe486ccfac1bac1501692ae96d2e492b8d0b88d9863985ff224efd03d565782a93cbebd21870376b42b34e5f4c698de727de9d512c30938f764c3da08b686ab",
  paymentAddress:
    "addr_test1qzd2ulz7jx0zn3t90vep26f7gl9wkj03lx0w5ca0vhnl5u6nfathe437695m4cwzlgn959uswtm56dkkmvxjx6h6mfssh7t4zy",
  paymentAddressEnterprise: "addr_test1vzd2ulz7jx0zn3t90vep26f7gl9wkj03lx0w5ca0vhnl5uc34x82v",
  paymentCred: "9aae7c5e919e29c5657b3215693e47caeb49f1f99eea63af65e7fa73",
  paymentAddressVerificationKey:
    "ed25519e_sk1kz5ugyvwfmlsa7pndwf40m352e4hzlyj0cw508a0uas33yn5hey94y9ev8q87spweqa6nghpr2zd2k7y4zewykm0faxfv8pgdl6q4xs5cam2t",
  stakingAddress: "stake_test1upf574mu6cldz6d6u8p05fj6z7g89a6dxmtdkrfrdtad5cggg7e4f",
  stakingCred: "534f577cd63ed169bae1c2fa265a179072f74d36d6db0d236afada61",
  poolId: "aa5a33e022780281587cc7140f5e0b507b1e52104e65eb7321682acf",
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
    balance: { value: 5_000_000_000n, assets: [] }, // Dummy 5K ADA
    delegation: null,
    rewards: 10_000_000n, // Dumnmy 10 ADA
  },
}
