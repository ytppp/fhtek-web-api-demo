## fhtek-web-api-demo

fhtek web pages, each router is in a directory.

## How to run

### for dev

- install dependencies manually in each folder
- make dev CUSTOMER_ID=xxxx MODEL_ID=xxxx
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0005 0006 0007 0014)
  - MODEL_ID should be oneof (M2R2 M6R0 M7R0 M8R0)

### for prd

- make CUSTOMER_ID=xxxx MODEL_ID=xxxx
  - CUSTOMER_ID should be oneof (0001 0002 0003 0004 0005 0006 0007 0014)
  - MODEL_ID should be oneof (M2R2 M6R0 M7R0 M8R0)

### for test

todo

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Compile and Minify for Production

```sh
pnpm build
```

### Lint with [ESLint](https://eslint.org/)

```sh
pnpm lint
```
