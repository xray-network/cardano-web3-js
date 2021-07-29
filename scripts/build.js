const fs = require('fs')
const path = require('path')
const package = require('../package.json')

const versions = [
  {
    postfix: 'browser',
    lib: '@emurgo/cardano-serialization-lib-browser',
  },
  {
    postfix: 'nodejs',
    lib: '@emurgo/cardano-serialization-lib-nodejs',
  },
  {
    postfix: 'asmjs',
    lib: '@emurgo/cardano-serialization-lib-asmjs',
  },
]

// clean
fs.rmdirSync('./publish', { recursive: true })
fs.mkdirSync('./publish')

// process
versions.forEach(v => {
  const versionName = `cardano-web3-${v.postfix}`

  const packageFields = {
    "name": versionName,
    "version": package.version,
    "description": package.description,
    "license": package.license,
    "repository": package.repository,
    "homepage": package.homepage,
    "bugs": package.bugs,
    "keywords": package.keywords,
    "main": "index.js",
    "dependencies": package.dependencies,
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

  // copy files
  copyFolderSync('./src', `./publish/${versionName}`)
  fs.copyFileSync('./LICENSE', `./publish/${versionName}/LICENSE`)
  fs.copyFileSync('./README.md', `./publish/${versionName}/README.md`)

  // process package.json
  fs.writeFileSync(`./publish/${versionName}/package.json`, JSON.stringify(packageFields, null, 2))
  fs.readFile(`./publish/${versionName}/index.js`, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    var result = data.replace(/..\/package.json/g, './package.json')

    fs.writeFile(`./publish/${versionName}/index.js`, result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })

  // replace serialization lib
  fs.readFile(`./publish/${versionName}/crypto/index.js`, 'utf8', function (err, data) {
    if (err) {
      return console.log(err)
    }
    var result = data.replace(/\@emurgo\/cardano-serialization-lib-browser/g, v.lib)

    fs.writeFile(`./publish/${versionName}/crypto/index.js`, result, 'utf8', function (err) {
      if (err) return console.log(err)
    })
  })

})