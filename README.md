# Electron template

Barebone template for Electron app. Copy this template to new repo and start adding screens and functionalities.

## INSTALLATION

1. Always install dependencies FIRST: `npm i`

1. Transpile TypeScript and SASS files: `gulp`

1. Start application: `npm start`

## DEVELOPMENT

* Transpile and watch for edit: `gulp watch`

## RELEASE

1. Transpile TypeScript and SASS files: `gulp release`

1. Release a distribution: `npm run release`

    * Speed up packing by changing `build.compression` in `package.json` with one of these values: "maximum" - VERY SLOW (for production); "normal" - SLOW (default); "store" - FAST (for development).