# Work with signatures

## User how to

```shell
gpg --version
```
```text
gpg (GnuPG) 2.2.19
libgcrypt 1.8.5
Copyright (C) 2019 Free Software Foundation, Inc.
....
Supported algorithms:
Pubkey: RSA, ELG, DSA, ECDH, ECDSA, EDDSA
Cipher: IDEA, 3DES, CAST5, BLOWFISH, AES, AES192, AES256, TWOFISH,
        CAMELLIA128, CAMELLIA192, CAMELLIA256
Hash: SHA1, RIPEMD160, SHA256, SHA384, SHA512, SHA224
Compression: Uncompressed, ZIP, ZLIB, BZIP2
```

### Sign a file with detached signature

Input: file
Output: another file with signature only

Create test file
```shell
echo -e 'hello\n' > 1s.txt
cat 1s.txt
```
Sign
```shell
gpg -ab 1s.txt
# OR use 'v' to see details (algorithm, user..):
# gpg -v -ab 1s.txt
cat 1s.txt.asc
```
Here is an output of `asc` file with signature
```text
-----BEGIN PGP SIGNATURE-----

iQIzBAABCgAdFiEEVUcfD9jeufsD1JVP3UX6TcUPhfEFAmC7Q2gACgkQ3UX6TcUP
hfHvVw/9EGorhwxduN2W4PNx14MIKKU8OgcYVljrijZ5eXC5NNz9WwBCplnzn4ZX
XMgkA9Wi9f0FBMVXdiLm6BENfHI4AQhNcDWkXCw/PeWA9NIPQBuE/kJ1AbfCxhpD
2S+lWm5lx9fRZge6v0rJ2GUPyNMxf4yzgRk9mO7e49iJuocuBN4THUcgNAtR3aA3
xg24O44jdHawwFBK7osV5Pzcoz2WXDtd9WQj7/+hpmU6rqLpiLrwHdd57I40i5Yu
Yg7hzOfBdu+gxnn2jy7Ka2wqLJvgKpskoB+oe7fMAiI0Jz1vUZCdLQh+dwwiqdQM
tIBT5mcleMRoTM2XkZ2Xcpwh8KdZ+q7dMyMA09ta4jvyKkuONlB7hVFmoB2t+Tbd
twkBBl69QYsjXRJU9i/nfOMeEUowFS4OlDzKxqa+unM5/WzJcRW7nW/XzgWNRPqe
uyXuPJqkdHfg0Jp6+jtP+IZyysdVT5PglHpSmEtqolustSA2sHUUCUUjUAFek2/i
c/ktBQAkD4yV+4RcVnv4lGYTvr7AJvMwceJwlJb0WxEph5E/sNHB4YWuXwQdE9z2
SVHREFUkouR+hnv0XaCUlcAkKRm8fU4XsLPlYNyMrw5KZKFpIBhXE346gVufkEDk
TaVHnbJ8jErfklgnRTPibX8AdmEFJasONNMJ/7euoBoH+aAYG/k=
=B0/L
-----END PGP SIGNATURE-----

```

#### Verify

```shell
gpg --verify 1s.txt.asc
```
```text
gpg: assuming signed data in '1s.txt'
gpg: Signature made Sat 05 Jun 2021 01:07:05 PM EEST
gpg:                using RSA key 5547..................................F1
gpg: Good signature from "Grigory .......... <..........@gmail.com>" [ultimate]

```

#### Combine message and signature
```shell
echo -e 'hello\n' | gpg --clear-sign -
```
#### Use user for signing
```shell
gpg -vab --local-user 0B7B99EB466D3F5D525D7E269645B577DB71D157 1s.txt
# OR use with specific key
echo -e 'hello\n' | gpg --local-user 0B7B99EB466D3F5D525D7E269645B577DB71D157 --clear-sign -
```
### Export your key

Be careful and export only your public key
```shell
# DD45FA4DC50F85F1 is key id
gpg --armor --export DD45FA4DC50F85F1
```
At the beginning and end must be line with *PUBLIC KEY*
```text
-----BEGIN PGP PUBLIC KEY BLOCK-----

mQINBF//CqwBEADQ622oqnAs9qFAH8sM0rXo+U8BOg95G8/16awsPsOPjdV1kxNs
nAoFL1Xt5HCELslo4S6vjNMtIHLm6Jw3Hu0sUlfW81lu+q53XhFZcP22HB/MIRhD
....
   .
   .
....
1Rzrx1yFHF7oKiNmI8TLejQ=
=O9gO
-----END PGP PUBLIC KEY BLOCK-----

```

### Other

```shell
# list keys
gpg --list-keys
# list keys and signatures
gpg --list-signatures
# import key
echo '--....PGP PUBLIC KEY...--' | gpg --import -

```
