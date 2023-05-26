# ToDo

[source](./ts/index.ts)

# Build

## Before npm install
You need to build [client-sdk](../client-sdk)
to do so follow build section in [client-sdk/README.md](../client-sdk/README.md)

## npm install + build
```bash
npm install
npm run build
```
Module exports different env builds
there is UMD for compatibility

That's it - you may now install it.

# Local installation

Local installation is work on your local environment - only developers use it!
If you want to develop your own project and ok with local installation follow next steps

Pre requirements - npm which can do local folder install
```bash
npm i -g npm
$ npm -v
# 9.4.2
```
After building project
```bash
# cd to YourProject
cd ../api/
# and use [relative] file path
# uses sym LINKS:
npm install --save ../client-sdk
# OR copy
npm install ../client-sdk --install-links
```
