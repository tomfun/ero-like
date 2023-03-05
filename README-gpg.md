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
# sign into file
gpg -vab --local-user 0B7B99EB466D3F5D525D7E269645B577DB71D157 1s.txt
# input and signature in one
echo -e 'I read and agree with all terms of use of ero-like and confirm my registration on ero-like' | gpg --local-user 0B7B99EB466D3F5D525D7E269645B577DB71D157 --clear-sign -
# priority: --local-user 16AC27C7C31F6127!
```
### Export your key

Be careful and export only your public key
```shell
# DD45FA4DC50F85F1 is key id; see list keys below
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
# list and check
gpg --check-signatures  --list-options=show-usage,show-unusable-uids,show-sig-subpackets
# list secret keys
gpg --list-secret-keys

# import key
echo '--....PGP PUBLIC KEY...--' | gpg --import -
# not import but dry-run. gives different output
echo '--....PGP PUBLIC KEY...--' | gpg --show-keys -

```

#### Extended usage

Sign with faked time, anotation, user, expiration piped to verirify which shows data
```bash
echo -e 'I read and agree with all terms of use of ero-like and confirm my registration on ero-like' \
    | docker run -i -v $(pwd)/docker/data/gpg/.gnupg:/root/.gnupg -e GPG_TTY=/dev/console \
    vladgh/gpg --clear-sign --local-user 1E11B59089A05C6B --set-notation name@ero-like.online=value --default-sig-expire 1 --faked-system-time 20230304T143648 \
    | docker run -i  -v $(pwd)/docker/data/gpg/.gnupg:/root/.gnupg \
    vladgh/gpg --verify --verify-options show-notation
```

#### Read sign packet contents
```bash
echo -e 'I read and agree with all terms of use of ero-like and confirm my registration on ero-like'     | docker run -i -v $(pwd)/docker/data/gpg/.gnupg:/root/.gnupg -e GPG_TTY=/dev/console     vladgh/gpg --clear-sign --local-user 1E11B59089A05C6B --set-notation name@ero-like.online=value --default-sig-expire 1 --faked-system-time 20230304T143648 > p.1E11B59089A05C6B.txt

cat p.1E11B59089A05C6B.txt | docker run -i vladgh/gpg --list-packets --verbos -
cat p.1E11B59089A05C6B.txt | docker run -i vladgh/gpg --dearmor | docker run -i vladgh/gpg --list-packets --verbos -
cat p.1E11B59089A05C6B.txt | tail --lines=8 | docker run -i vladgh/gpg --list-packets --verbos -
```


#### Try to forge cert
fake 1 byte at 11byte offset (0x0B):
```bash
# https://stackoverflow.com/questions/41806280/modify-a-byte-in-a-binary-file-using-standard-linux-command-line-tools
cat p.txt | gpg --dearmor > p.bin
echo $b_hex
b_hex=$(xxd -seek $((16#B)) -l 1 -ps p.bin -)
cp p.bin p_a8.bin
echo "000b: a8" | xxd -r - p_a8.bin
cat p_a8.bin | gpg --enarmor > p_a8.txt
# see result
cat p_a8.txt | docker run -i -v $(pwd)/docker/data/gpg/.gnupg:/root/.gnupg -e GPG_TTY=/dev/console -e GNUPGHOME=/tmp vladgh/gpg --list-packets --verbos -
```
try to import
`cat p_a8.txt | docker run -i -v $(pwd)/docker/data/gpg/.gnupg:/root/.gnupg -e GPG_TTY=/dev/console -e GNUPGHOME=/tmp vladgh/gpg --import -`
```text
gpg: keybox '/tmp/pubring.kbx' created
gpg: key 08639A81C0D6E671: 3 signatures not checked due to missing keys
gpg: key 08639A81C0D6E671: no valid user IDs
gpg: this may be caused by a missing self-signature
gpg: Total number processed: 1
gpg:           w/o user IDs: 1
```
