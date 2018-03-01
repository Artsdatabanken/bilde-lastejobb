const io = require('./lib/io')
const config = require('./config')

let koder = io.readJson(config.datafil.nin_koder_importert)
let variasjon = io.readJson(config.datafil.nin_variasjon_importert)
let overrides = io.readJson(config.datafil.nin_hierarki_overrides)

const alle = Object.assign({}, koder, variasjon)
console.log('Lest inn ' + Object.keys(alle).length + ' koder')
let noder = {}
let p2c = {}

for (let kode of Object.keys(alle)) {
  const node = alle[kode]
  node.kode = kode
  let foreldre = node.forelder ? [node.forelder] : []
  if (overrides[kode]) foreldre = overrides[kode]
  node.foreldre = foreldre
  delete node.forelder
  noder[kode] = node
  for (let forelder of foreldre) {
    if (!p2c[forelder]) p2c[forelder] = []
    p2c[forelder].push(node)
  }
}

function leggTilBarn(node) {
  noder[node.kode] = node
  const barn = p2c[node.kode]
  if (barn) {
    node.barn = barn.map(node => node.kode)
  }
}

for (let kode of Object.keys(alle)) leggTilBarn(alle[kode])

io.writeJson(config.datafil.nin_liste, noder)
console.log('Importert ' + Object.keys(noder).length + ' koder')
