const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')

let koder = io.readJson(config.datafil.nin_koder_importert).data
let variasjon = io.readJson(config.datafil.nin_variasjon_importert).data
let overrides = io.readJson(config.datafil.nin_hierarki_overrides).data

const alle = Object.assign({}, koder, variasjon)
let noder = {}
let p2c = {}

let fjernet = []

function skalMedISystemet(kode) {
  // Kartleggingsenheter B og D utgår
  if (kode.match(/NA_.*-B-/g) || kode.match(/NA_.*-D-/g)) return false
  return true
}

for (let kode of Object.keys(alle))
  if (!skalMedISystemet(kode)) {
    fjernet.push(kode)
    delete alle[kode]
  }

for (let kode of Object.keys(alle)) {
  const node = alle[kode]
  node.kode = kode

  if (overrides[kode]) node.foreldre = overrides[kode]
  noder[kode] = node
  for (let forelder of node.foreldre) {
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

log.i('Fjernet ' + fjernet)

io.writeJson(config.datafil.nin_liste, noder)
