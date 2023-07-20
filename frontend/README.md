# frontend

## Project setup

### Before npm install
You need to build [client-config]([../client-config])
to do so follow build section in [client-config/README.md](../client-config/README.md)

You need to build [client-sdk](../client-sdk)
to do so follow build section in [client-sdk/README.md](../client-sdk/README.md)

After **building** just follow next - npm will install it, you don't need extra steps
(local installation)

### npm install
```sh
nvm install
nvm use
npm install
```

### Compile and Hot-Reload for Development

```sh
# without docker
npm run dev
# with docker compose
docker compose up frontend
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

This template should help get you started developing with Vue 3 in Vite.

## Project uses localization

Best place to understand [messages.ftl](./src/locales/en/messages.ftl) is https://projectfluent.org/

## VSCode Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has also implemented a [Take Over Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
    1) Run `Extensions: Show Built-in Extensions` from VSCode's command palette
    2) Find `TypeScript and JavaScript Language Features`, right click and select `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the command palette.
