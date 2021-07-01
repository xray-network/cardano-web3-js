const fs = require('fs')
const path = require('path')
const version = require('../package.json').version
const dependencies = require('../package.json').dependencies

const package = {
  "name": 'cardano-web3.js',
  version,
  "author": "Ray Network",
  "description": "Cardano Web3 JavaScript API",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/ray-network/cardano-web3.js.git"
  },
  "homepage": "https://github.com/ray-network/cardano-web3.js",
  "bugs": {
    "url": "https://github.com/ray-network/cardano-web3.js/issues"
  },
  "keywords": [
    "Cardano",
    "JavaScript",
    "API"
  ],
  "module": "cardano-web3.js",
  "sideEffects": false,
  "main": "index.js",
  dependencies,
}

function copyFolderSync(from, to) {
  fs.mkdirSync(to)
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element))
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element))
    }
  })
}

fs.rmdirSync('./publish', { recursive: true })
copyFolderSync('./src', './publish')
fs.copyFileSync('./LICENSE', './publish/LICENSE')
fs.copyFileSync('./README.md', './publish/README.md')
fs.writeFileSync('./publish/package.json', JSON.stringify(package, null, 2))
fs.readFile('./publish/index.js', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  var result = data.replace(/..\/package.json/g, './package.json')

  fs.writeFile('./publish/index.js', result, 'utf8', function (err) {
    if (err) return console.log(err)
  })
})