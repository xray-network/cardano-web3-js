import { Buffer } from "buffer"
import Blake2b from "blake2b"

const LETTERS = `ABCDEJHKLNOPSTXZ`

function hash(len: number, input: string, message: string) {
  return Blake2b(len, undefined, undefined, new Uint8Array(Buffer.from(message)))
    .update(new Uint8Array(Buffer.from(input)))
    .digest("hex")
}

function textPartFromWalletChecksumImagePart(walletChecksum: string): string {
  return textPartFromBytes(toBytesInt32(fast1a32(walletChecksum)))
}

function toBytesInt32(int32: number): [number, number, number, number] {
  const byteArray: [number, number, number, number] = [0, 0, 0, 0]

  for (let index = 0; index < byteArray.length; index++) {
    const byte = int32 & 0xff
    byteArray[index] = byte
    int32 = (int32 - byte) / 256
  }

  return byteArray
}

function fast1a32(str: string) {
  var i,
    l = str.length - 3,
    t0 = 0,
    v0 = 0x9dc5,
    t1 = 0,
    v1 = 0x811c

  for (i = 0; i < l; ) {
    v0 ^= str.charCodeAt(i++)
    t0 = v0 * 403
    t1 = v1 * 403
    t1 += v0 << 8
    v1 = (t1 + (t0 >>> 16)) & 65535
    v0 = t0 & 65535
    v0 ^= str.charCodeAt(i++)
    t0 = v0 * 403
    t1 = v1 * 403
    t1 += v0 << 8
    v1 = (t1 + (t0 >>> 16)) & 65535
    v0 = t0 & 65535
    v0 ^= str.charCodeAt(i++)
    t0 = v0 * 403
    t1 = v1 * 403
    t1 += v0 << 8
    v1 = (t1 + (t0 >>> 16)) & 65535
    v0 = t0 & 65535
    v0 ^= str.charCodeAt(i++)
    t0 = v0 * 403
    t1 = v1 * 403
    t1 += v0 << 8
    v1 = (t1 + (t0 >>> 16)) & 65535
    v0 = t0 & 65535
  }

  while (i < l + 3) {
    v0 ^= str.charCodeAt(i++)
    t0 = v0 * 403
    t1 = v1 * 403
    t1 += v0 << 8
    v1 = (t1 + (t0 >>> 16)) & 65535
    v0 = t0 & 65535
  }

  return ((v1 << 16) >>> 0) + v0
}

function textPartFromBytes([a, b, c, d]: [number, number, number, number]): string {
  const letters = (x: number): string => `${LETTERS[Math.floor(x / 16)]}${LETTERS[x % 16]}`
  const numbers = `${((c << 8) + d) % 10000}`.padStart(4, "0")
  return `${letters(a)}${letters(b)}-${numbers}`
}

export default function walletChecksum(publicKeyHash: string) {
  const checksumImage = hash(64, publicKeyHash, "wallets checksum")
  const checksumId = textPartFromWalletChecksumImagePart(checksumImage)
  return { checksumId, checksumImage }
}
