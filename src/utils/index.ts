import AssetFingerprint from "@emurgo/cip14-js"
import * as Bip39 from "bip39"
import * as Bech32 from "bech32"
import * as T from "../types"

export class Utils {
  private cw3: T.CardanoWeb3
  private network: T.NetworkConfig
  private C: T.C

  static init = (cw3: T.CardanoWeb3) => {
    const utils = new Utils()
    utils.cw3 = cw3
    utils.network = cw3.network
    utils.C = cw3.C
    return utils
  }

  Bip39 = Bip39

  Bech32 = Bech32.bech32

  keys = {
    mnemonicGenerate: (length: 12 | 15 | 24 = 24) => {
      return this.Bip39.generateMnemonic((32 * length) / 3)
    },

    mnemonicValidate: (mnemonic: string) => {
      return this.Bip39.validateMnemonic(mnemonic)
    },

    xprvKeyGenerate: () => {
      return this.C.Bip32PrivateKey.generate_ed25519_bip32().to_bech32()
    },

    xprvKeyValidate: (xprvKey: string) => {
      try {
        this.C.Bip32PrivateKey.from_bech32(xprvKey).to_bech32()
        return true
      } catch {
        return false
      }
    },

    xprvKeyFromMnemonic: (mnemonic: string) => {
      return this.C.Bip32PrivateKey.from_bip39_entropy(
        this.misc.fromHex(this.Bip39.mnemonicToEntropy(mnemonic)),
        new Uint8Array()
      ).to_bech32()
    },

    xpubKeyFromXprvKey: (xprvKey: string) => {
      return this.C.Bip32PrivateKey.from_bech32(xprvKey).to_public().to_bech32()
    },

    xpubKeyFromXvkKey: (xvkKey: string) => {
      return this.Bech32.encode("xpub", this.Bech32.decode(xvkKey, 118).words, 114)
    },

    xpubKeyValidate: (pubKey: string) => {
      try {
        this.C.Bip32PublicKey.from_bech32(pubKey)
        return true
      } catch {
        return false
      }
    },
  }

  address = {
    deriveBase: (xpubKey: string, path: T.AddressDerivationPath) => {
      const paymentKeyHash = this.C.Bip32PublicKey.from_bech32(xpubKey)
        .derive(path[0])
        .derive(path[1])
        .to_raw_key()
        .hash()
      const stakeKeyHash = this.C.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()

      return this.C.BaseAddress.new(
        this.network.id,
        this.C.Credential.new_pub_key(paymentKeyHash),
        this.C.Credential.new_pub_key(stakeKeyHash)
      )
        .to_address()
        .to_bech32()
    },

    deriveEnterprise: (xpubKey: string, path: T.AddressDerivationPath) => {
      const paymentKeyHash = this.C.Bip32PublicKey.from_bech32(xpubKey)
        .derive(path[0])
        .derive(path[1])
        .to_raw_key()
        .hash()

      return this.C.EnterpriseAddress.new(this.network.id, this.C.Credential.new_pub_key(paymentKeyHash))
        .to_address()
        .to_bech32()
    },

    deriveStaking: (xpubKey: string) => {
      const stakeKeyHash = this.C.Bip32PublicKey.from_bech32(xpubKey).derive(2).derive(0).to_raw_key().hash()

      return this.C.RewardAddress.new(this.network.id, this.C.Credential.new_pub_key(stakeKeyHash))
        .to_address()
        .to_bech32()
    },

    getStakingAddress: (addrBech32: string) => {
      const address = this.C.Address.from_bech32(addrBech32)
      const stakingCred = address.staking_cred()
      return this.C.RewardAddress.new(address.network_id(), stakingCred).to_address().to_bech32()
    },

    getCredentials: (addrBech32: string) => {
      const address = this.C.Address.from_bech32(addrBech32)
      return {
        paymentCred: address.payment_cred()?.as_pub_key()?.to_hex(),
        stakingCred: address.staking_cred()?.as_pub_key()?.to_hex(),
      }
    },
  }

  account = {
    getDetailsFromXpub: (xpubKey: string) => {
      const changeAddress = this.address.deriveBase(xpubKey, [0, 0])
      const { paymentCred, stakingCred } = this.address.getCredentials(changeAddress)
      const stakingAddress = this.address.getStakingAddress(changeAddress)

      return {
        changeAddress,
        paymentCred,
        stakingCred,
        stakingAddress,
      }
    },
    getBalanceFromUtxos: (utxos: T.Utxo[]): T.Balance => {
      const balance: T.Balance = {
        lovelace: BigInt(0),
        assets: [],
      }

      for (const utxo of utxos) {
        balance.lovelace += utxo.value

        for (const asset of utxo.assets) {
          const existingAsset = balance.assets.find((a) => a.fingerprint === asset.fingerprint)
          if (existingAsset) {
            existingAsset.quantity += asset.quantity
          } else {
            balance.assets.push({ ...asset })
          }
        }
      }

      return balance
    },
  }

  asset = {
    getFingerprint: (policyId: string, assetName: string) => {
      return AssetFingerprint.fromParts(Buffer.from(policyId, "hex"), Buffer.from(assetName || "", "hex")).fingerprint()
    },
  }

  misc = {
    harden: (num: number): number => {
      return 0x80000000 + num
    },

    fromHex: (hex: string) => {
      return Buffer.from(hex, "hex")
    },

    toHex: (bytes: Buffer) => {
      return Buffer.from(bytes).toString("hex")
    },
  }
}
