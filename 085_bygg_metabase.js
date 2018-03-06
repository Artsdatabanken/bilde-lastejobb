const io = require('./lib/io')
const config = require('./config')

var data = io.readJson(config.datafil.flettet).data

function kopierAlias() {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    if (node.alias) {
      console.log(kode, '=>', node.alias)
      //     data[node.alias] = node
    }
  })
}

var p2c = {},
  c2p = {}

function mapForeldreTilBarn() {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    if (!c2p[kode]) c2p[kode] = []
    if (!node.foreldre) {
      if (!node.se) console.warn('Mangler forelder: ', kode)
    } else {
      //      let foreldre = Object.assign([], node.foreldre, node.foreldreAlias)
      let foreldre = node.foreldre
      foreldre.forEach(forelderkode => {
        const forelder = data[forelderkode]
        if (forelder.se) forelderkode = forelder.se
        if (!p2c[forelderkode]) p2c[forelderkode] = []
        p2c[forelderkode].push(kode)
        if (!c2p[kode].includes(forelderkode)) c2p[kode].push(forelderkode)
      })
    }
  })
}

kopierAlias()
mapForeldreTilBarn()

//console.log(data['NA_I1'])
//console.log(c2p['NA_I1'])
//throw new Error()

function tittel(node) {
  console.log(node)
  const tittel = node.tittel
  if (!tittel) console.error('titt', node)
  if (tittel.nb) return tittel.nb
  if (tittel.la) return tittel.la
  return node.kode
}

function hentKey(key) {
  let node = data[key]
  if (node.se) return node.se
  return key
}

function nøstOppForfedre(forelderkey) {
  let r = []
  while (forelderkey) {
    forelderkey = hentKey(forelderkey)
    let forelder = data[forelderkey]
    /*    console.log(
      forelderkey,
      '=>',
      forelder && forelder.foreldre ? forelder.foreldre[0] : '?'
    )*/
    r.push({ [forelderkey]: { kode: forelder.kode, tittel: forelder.tittel } })
    //    console.log(forelderkey)
    forelderkey = c2p[forelderkey][0]
  }
  return r
}

function fjernPrefiks(kode, rotkode) {
  kode = kode.replace(rotkode, '')
  if ('_-'.indexOf(kode[0]) >= 0) return kode.substring(1)
  return kode
}

function byggTreFra(key) {
  let rot = data[key]
  if (!rot) console.warn('Finner ikke ' + key)
  rot.kode = key
  if (!rot.foreldre) console.log(key)
  rot.overordnet =
    rot.foreldre && rot.foreldre.length > 0
      ? nøstOppForfedre(rot.foreldre[0])
      : ''
  let node = { '@': rot }
  let barn = {}
  if (p2c[key]) {
    p2c[key].forEach(ckey => {
      const cnode = data[ckey]
      const ckode = cnode.kode
      barn[ckey] = {
        kode: ckode,
        tittel: cnode.tittel,
        relasjoner: cnode.relasjoner
      }
      node[fjernPrefiks(ckode, rot.kode)] = byggTreFra(ckey)
    })
  }
  node['@'].barn = barn
  if (key === 'NA') console.log('rotnode', node)
  if (key === config.rotkode) console.log('rotnode', node)
  delete node['@'].foreldre
  return node
}

console.log(fjernPrefiks('NA', config.rotkode))
console.log(p2c['AR'])
const r = byggTreFra(config.rotkode)
//console.log(JSON.stringify(byggTreFra('AR_Animalia_Chordata_Tunicata')))
//console.log('NA_T44', nøstOppForfedre(['NA_T44']))
//console.log(r['NA']['T']['1'])
//console.log(r.TX['@'])
//console.log(r['@'])
//console.log(r.AR['@'])
//console.log(data['AR_Animalia_Chordata_Tunicata'])
io.writeJson(config.datafil.metabase, r)
