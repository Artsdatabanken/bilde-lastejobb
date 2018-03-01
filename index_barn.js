const fs = require('fs')
const path = require('path')
const { kodkode, splittKode, lookup, lookupWithCreate } = require('./lib/koder')

function readJson(filePath) {
  const data = fs.readFileSync(filePath)
  return (json = JSON.parse(data))
}

let db = readJson('../input/v2.json')

function updateBarn(parent) {
  if (!parent['@']) {
    console.warn('Nonexistant')
    console.warn(parent)
    return
  }
  console.log(parent['@'].kode)
  const allBarnKeys = Object.keys(parent).filter(x => x !== '@')
  allBarnKeys.forEach(c => {
    node = parent[c]
    updateBarn(node)
  })

  if (!parent['@']) parent['@'] = {}
  if (!parent['@'].barn) parent['@'].barn = {}
  let selfbarn = parent['@'].barn
  allBarnKeys.forEach(bk => {
    const barn = parent[bk]
    if (!selfbarn[bk]) selfbarn[bk] = {}
    selfbarn[bk].tittel = barn['@'].tittel || bk
  })
}

updateBarn(db)

fs.writeFileSync('nydb.json', JSON.stringify(db))
