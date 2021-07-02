const fs = require('fs')
const package = require('../package.json')

const packageFields = {
  "name": package.name,
  "version": package.version,
  "author": package.author,
  "description": package.description,
  "license": package.license,
  "repository": package.repository,
  "homepage": package.homepage,
  "bugs": package.bugs,
  "keywords": package.keywords,
  "main": "cardano-web3.js",
}

fs.rmdirSync('./dist', { recursive: true })
fs.mkdirSync('./dist', { recursive: true })
fs.copyFileSync('./LICENSE', './dist/LICENSE')
fs.copyFileSync('./README.md', './dist/README.md')
fs.writeFileSync('./dist/package.json', JSON.stringify(packageFields, null, 2))