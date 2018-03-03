const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.flettet).data

function kopierAlias() {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    if (node.alias) data[node.alias] = node
  })
}

var p2c = {},
  c2p = {}
function mapForeldreTilBarn() {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    if (!node.foreldre) console.warn('Mangler forelder: ', kode)
    else {
      let foreldre = Object.assign([], node.foreldre, node.foreldreAlias)
      foreldre.forEach(forelder => {
        if (!p2c[forelder]) p2c[forelder] = []
        p2c[forelder].push(kode)
        if (!c2p[kode]) c2p[kode] = []
        c2p[kode].push(forelder)
      })
    }
  })
}

console.log(c2p['NA_T'])
kopierAlias()
mapForeldreTilBarn()

function tittel(node) {
  const tittel = node.tittel
  if (!tittel) console.error('titt', node)
  if (tittel.nb) return tittel.nb
  if (tittel.la) return tittel.la
  return node.kode
}
function nøstOppForfedre(fnode) {
  if (!fnode) return []
  let forelderkode = fnode[0]
  let r = []
  forelderkode = c2p[forelderkode]
  while (forelderkode) {
    const forelder = data[forelderkode]
    r.push({ [forelderkode]: tittel(forelder) })
    forelderkode = c2p[forelderkode]
  }
  return r
}

function fjernPrefiks(kode, rotkode) {
  kode = kode.replace(rotkode, '')
  if ('_-'.indexOf(kode[0]) >= 0) return kode.substring(1)
  return kode
}

let count = 0
function byggTreFra(rotkode) {
  let rot = data[rotkode]
  if (!rot) console.warn('Finner ikke ' + rotkode)
  rot.kode = rotkode
  if (!rot.foreldre) console.log(rotkode)
  console.log('r', rot.foreldre)
  rot.foreldre = nøstOppForfedre(rot.foreldre)
  console.log('r', rot.foreldre)
  let node = { '@': rot }
  let barn = {}
  if (p2c[rotkode])
    p2c[rotkode].forEach(kode => {
      barn[kode] = {
        kode: kode,
        tittel: data[kode].tittel,
        relasjoner: data[kode].relasjoner
      }
      node[fjernPrefiks(kode, rotkode)] = byggTreFra(kode)
    })
  node['@'].barn = barn
  return node
}

//console.log(nøstOppForfedre(['NA_T44']))
const r = byggTreFra(config.rotkode)
//console.log(r['NA']['T']['1'])
//console.log(r.TX['@'])
console.log(r.AO['01'])

io.writeJson(config.datafil.metabase, r)
