# ToDo

[source](./ts/index.ts)

# Build

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

# Gitlab installation

## Links
Instructions:
https://gitlab.com/tommyInc/ero-like/-/packages/1

Common knowledge:
https://docs.gitlab.com/ee/user/packages/npm_registry/  
instance-level-installation: https://gitlab.com/help/user/packages/npm_registry/  index#install-from-the-instance-level
project-level-installation: https://gitlab.com/help/user/packages/npm_registry/index#install-from-the-project-level
> Replace `your_token` with a deploy token, group access token, **project access token**, or
 personal access token.

## CI installation

Usefull to build dependency securely inside our gitlab (https://gitlab.com/)

You don't need commit `.npmrc` to your project and store shared token, which is insecure.  
In CI script you have to add

```bash
# installing via gitlab CI can be done via CI token: 
echo "@tommyInc:registry=https://${CI_SERVER_HOST}/api/v4/packages/npm/" >> .npmrc && \
echo "//${CI_SERVER_HOST}/api/v4/packages/npm/:_authToken=${CI_JOB_TOKEN}" >> .npmrc && \
```

## Local development installation

You don't need commit `.npmrc` to your project. You could save config at your development PC.

```bash
# for local development you need token
npm config set -- //gitlab.com/api/v4/packages/npm/:_authToken=vRaWXWQ1TRJsjN9Fyy2n
npm config set @tommyInc:registry https://gitlab.com/api/v4/packages/npm/
```

## Shared committed token

Commonly for internal projects we may create **project** access token with `read_api` scope

create `.npmrc` file near `package.json` with content:
```
@tommyInc:registry=https://gitlab.com/api/v4/projects/156/packages/npm/
//gitlab.com/api/v4/projects/156/packages/npm/:_authToken=vRaWXWQ1TRJsjN9Fyy2n

```


## Install

```bash
# and install
npm install --save-dev ero-like-sdk
```
