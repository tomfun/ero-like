import * as openpgp from 'openpgp'

export async function generateKeys({ passphrase }: { passphrase: string }) {
  return openpgp.generateKey({
    type: 'rsa',
    date: new Date(),
    rsaBits: 3072,
    passphrase,
    userIDs: [
      {
        name: `browserStorage${Math.round(Math.random() * 100000)}`,
      },
    ],
    format: 'armored',
    config: {
      commentString: 'ero-like frontend generated',
      passwordCollisionCheck: true,
    },
  })
}
