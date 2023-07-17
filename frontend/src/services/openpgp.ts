import * as openpgp from 'openpgp'
import { CausedError } from '../utils'

export class OpenpgpError extends CausedError {}

export class ReadPrivateKeyOpenpgpError extends OpenpgpError {}

export class DecryptPrivateKeyOpenpgpError extends OpenpgpError {}

export class SignOpenpgpError extends OpenpgpError {}

export async function generateKeys({ passphrase }: { passphrase: string }) {
  const date = new Date()
  return openpgp.generateKey({
    type: 'ecc',
    curve: 'ed25519',
    date,
    passphrase,
    userIDs: [
      {
        name: `browserStorage${Math.round(Math.random() * 100000)}`,
      },
    ],
    subkeys: [
      {
        type: 'ecc',
        curve: 'curve25519',
        date,
      },
    ],
    format: 'armored',
    config: {
      commentString: 'ero-like frontend generated',
      passwordCollisionCheck: true,
    },
  })
}

export async function sign(
  {
    passphrase,
    privateKeyArmored,
  }: {
    passphrase: string
    privateKeyArmored: string
  },
  text: string,
) {
  let privateKey: openpgp.PrivateKey
  try {
    privateKey = await openpgp.readPrivateKey({ armoredKey: privateKeyArmored })
  } catch (e) {
    throw new ReadPrivateKeyOpenpgpError(e)
  }
  try {
    privateKey = await openpgp.decryptKey({
      privateKey,
      passphrase,
    })
  } catch (e) {
    throw new DecryptPrivateKeyOpenpgpError(e)
  }

  const unsignedMessage = await openpgp.createCleartextMessage({ text })
  try {
    return await openpgp.sign({
      message: unsignedMessage, // CleartextMessage or Message object
      signingKeys: privateKey,
    })
  } catch (e) {
    throw new SignOpenpgpError(e)
  }
}
