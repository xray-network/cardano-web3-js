import fs from "fs"

/** Package files **/
fs.copyFileSync("./LICENSE", `./dist/LICENSE`)
fs.copyFileSync("./README.md", `./dist/README.md`)
fs.copyFileSync("./package.json", `./dist/package.json`)

/** Lucid License **/
fs.copyFileSync("./src/misc/lucid/LICENSE", `./dist/esm/misc/lucid/LICENSE`)
fs.copyFileSync("./src/misc/lucid/LICENSE", `./dist/cjs/misc/lucid/LICENSE`)

/** Anastasia Labs License **/
// fs.copyFileSync("./src/misc/uplc/LICENSE", `./dist/esm/misc/uplc/LICENSE`)
// fs.copyFileSync("./src/misc/uplc/LICENSE", `./dist/cjs/misc/uplc/LICENSE`)

/** Replace CML version **/
const C_REPLACE_FROM = "@dcspark/cardano-multiplatform-lib-nodejs"
const C_REPLACE_TO = "@dcspark/cardano-multiplatform-lib-browser"
const M_REPLACE_FROM = "@emurgo/cardano-message-signing-nodejs"
const M_REPLACE_TO = "@emurgo/cardano-message-signing-browser"
const filesToReplace = [
  `./dist/package.json`,
  `./dist/esm/core/loader.js`,
  `./dist/esm/core/loader.d.ts`,
  `./dist/cjs/core/loader.js`,
  `./dist/cjs/core/loader.d.ts`,
]
filesToReplace.forEach((file) => {
  const data = fs.readFileSync(file, "utf8")
  const result = data.replace(C_REPLACE_FROM, C_REPLACE_TO).replace(M_REPLACE_FROM, M_REPLACE_TO)
  fs.writeFileSync(file, result, "utf8")
})
