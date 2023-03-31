# ToDo

[source](./ts/index.ts)

# Build

## Before build
You need to build [../client-sdk]
to do so follow build section in [../client-sdk/README.md]

```bash
npm i
npm run build
```
Module exports different env builds
there is UMD for compatibility

# Local installation

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
