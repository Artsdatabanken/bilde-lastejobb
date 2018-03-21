const koder = require('./lib/koder')
const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')

let ninkoder = io.readJson(config.datafil.nin_koder_importert)
let variasjon = io.readJson(config.datafil.nin_variasjon_importert)
let overrides = io.readJson(config.datafil.nin_hierarki_overrides)

const alle = Object.assign({}, ninkoder, variasjon)
let noder = {}
let p2c = {}

let fjernet = []

function skalMedISystemet(kode) {
  // Grunntyper utgår.. for no
  if (koder.erGrunntype(kode)) return false
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

  var parts = kode.split('_')
  node.infoUrl = config.infoUrl.nin + parts[1]

  if (overrides[kode]) node.foreldre = overrides[kode]
  noder[kode] = node
  console.log(node)
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
