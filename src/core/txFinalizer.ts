import CML from "@dcspark/cardano-multiplatform-lib-nodejs"
import { CardanoWeb3 } from "./cw3"
import { Account } from "./account"
import utils from "@/utils"
import * as CW3Types from "@/types"

export class TxFinalizer {
  private cw3: CardanoWeb3
  private queue: (() => unknown)[] = []
  __tx: CML.Transaction
  __witnessBuilder: CML.TransactionWitnessSetBuilder

  constructor(cw3: CardanoWeb3, tx: string) {
    this.cw3 = cw3
    this.__tx = CML.Transaction.from_cbor_hex(tx)
    this.__witnessBuilder = CML.TransactionWitnessSetBuilder.new()
  }

  /**
   * Sign TX with private key
   * @param verificationKey Private key to sign with
   * @returns TxFinalizer instance
   */
  signWithVrfKey = (verificationKey: string) => {
    this.queue.push(async () => {
      const vkey = CML.PrivateKey.from_bech32(verificationKey)
      this.__witnessBuilder.add_vkey(CML.make_vkey_witness(CML.hash_transaction(this.__tx.body()), vkey))
    })
    return this
  }

  /**
   * Sign TX with account
   * @param account Account to sign with
   * @param utxos UTXOs to use for signing (trying to find used signing keys)
   * @param password Password to decode xprv key (optional)
   * @returns TxFinalizer instance
   */
  signWithAccount = (account: Account, utxos: CW3Types.Utxo[], password?: string) => {
    this.queue.push(async () => {
      if (account.__config.type === "xprv") {
        if (account.__config.xprvKeyIsEncoded && !password)
          throw new Error("Password is required to sign with xprv encoded account")
        const xprvKey = account.__config.xprvKeyIsEncoded
          ? account.getDecodedXprvKey(password)
          : account.__config.xprvKey

        const paymentVerificationKey = utils.keys.xprvToVrfKey(
          xprvKey,
          account.__config.accountPath,
          account.__config.addressPath
        )
        const paymentKey = CML.PrivateKey.from_bech32(paymentVerificationKey)
        const paymentKeyHash = paymentKey.to_public().hash().to_hex()

        const stakingVerificationKey = utils.keys.xprvToVrfKey(xprvKey, account.__config.accountPath, [2, 0])
        const stakingKey = CML.PrivateKey.from_bech32(stakingVerificationKey)
        const stakingKeyHash = stakingKey.to_public().hash().to_hex()

        if (utxos.length > 0) {
          const foundHashes = utils.tx.discoverOwnUsedTxKeyHashes(this.__tx, [stakingKeyHash, paymentKeyHash], utxos)
          if (foundHashes.includes(paymentKeyHash)) {
            this.__witnessBuilder.add_vkey(CML.make_vkey_witness(CML.hash_transaction(this.__tx.body()), paymentKey))
          }
          if (foundHashes.includes(stakingKeyHash)) {
            this.__witnessBuilder.add_vkey(CML.make_vkey_witness(CML.hash_transaction(this.__tx.body()), stakingKey))
          }
        }
      }
      if (account.__config.type === "connector") {
        const witnessSetHex = await account.__config.connector.signTx(this.__tx.to_cbor_hex())
        const witnessSet = CML.TransactionWitnessSet.from_cbor_hex(witnessSetHex)
        this.__witnessBuilder.add_existing(witnessSet)
      }
      if (account.__config.type === "ledger") {
        throw new Error("Ledger account signing is not implemented yet")
      }
      if (account.__config.type === "trezor") {
        throw new Error("Trezor account signing is not implemented yet")
      }
      if (account.__config.type === "xpub") {
        throw new Error("Can't sign TX with xpub account type. Use signWithVrfKey() method instead")
      }
    })

    return this
  }

  /**
   * Apply all methods and return TxFinalizer instance
   * @returns TxFinalizer instance
   */
  apply = async () => {
    // Add witness set to TX
    this.__witnessBuilder.add_existing(this.__tx.witness_set())

    // Execute queue tasks
    for (const task of this.queue) {
      await task()
    }

    // Rebuild finalized TX
    this.__tx = CML.Transaction.new(this.__tx.body(), this.__witnessBuilder.build(), true, this.__tx.auxiliary_data())

    return this
  }

  /**
   * Apply all methods and return TX in JSON format
   * @returns TX in JSON format
   */
  applyAndToJson = async () => {
    await this.apply()
    return {
      tx: this.__tx.to_cbor_hex(),
      hash: CML.hash_transaction(this.__tx.body()).to_hex(),
      json: this.__tx.to_js_value(),
    }
  }

  /**
   * Apply all methods and submit transaction to blockchain
   * @returns Transaction hash
   */
  applyAndSubmit = async () => {
    await this.apply()
    return await this.cw3.provider.submitTx(this.__tx.to_cbor_hex())
  }
}
