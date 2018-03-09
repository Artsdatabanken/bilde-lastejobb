const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')
const koder = require('./lib/koder')

var data = io.readJson(config.datafil.flettet).data

function settPrimærUrler() {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    if (!node.url) {
      node.url = koder.splittKode(kode).join('/')
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
        if (!p2c[forelderkode]) p2c[forelderkode] = []
        p2c[forelderkode].push(kode)
        if (!c2p[kode].includes(forelderkode)) c2p[kode].push(forelderkode)
      })
    }
  })
}

settPrimærUrler()
mapForeldreTilBarn()

function tittel(node) {
  const tittel = node.tittel
  if (!tittel) throw new Error('Mangler tittel', JSON.stringify(node))
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
    r.push({ [forelderkey]: { kode: forelder.kode, tittel: forelder.tittel } })
    forelderkey = c2p[forelderkey][0]
  }
  return r
}

function fjernPrefiks(kode, rotkode) {
  const før = kode
  kode = kode.replace(rotkode, '')
  if ('/_-'.indexOf(kode[0]) >= 0) kode = kode.substring(1)
  return kode
}

function byggTreFra(tre, key) {
  log.d('bygger', key)
  let rot = data[key]
  if (!rot) throw new Error('Finner ikke ' + key)
  rot.kode = key
  if (!rot.foreldre) console.log('noparent', key)
  rot.overordnet =
    rot.foreldre && rot.foreldre.length > 0
      ? nøstOppForfedre(rot.foreldre[0])
      : ''
  let node = { '@': rot, url: rot.url }
  let barn = {}
  if (p2c[key]) {
    p2c[key].forEach(ckey => {
      const cnode = data[ckey]
      const ckode = cnode.kode
      barn[ckey] = {
        url: cnode.url,
        kode: ckode,
        tittel: cnode.tittel,
        relasjoner: cnode.relasjoner
      }
      //      settInn(tre, cnode)
      //        const subUrl = fjernPrefiks(cnode.url, rot.url)
      //       node[subUrl] = byggTreFra(ckey)
      //        node[fjernPrefiks(ckode, rot.kode)] = byggTreFra(ckey)
      const child = byggTreFra(tre, ckey)
      //settInn(tre, child)
    })
  }
  node['@'].barn = barn
  delete node['@'].foreldre
  settInn(tre, node, key, rot)
  if (key === 'NA') console.log(key)
  if (key === 'NA') console.log(node)
  return node
}

function settInn(tre, targetNode, kode, node) {
  if (targetNode.url.length === 0) {
    if (kode === 'NA') console.log('NONONO')
    Object.keys(targetNode).forEach(key => {
      if (key === 'NA') console.log('NONONO')
      tre[key] = Object.assign({}, tre[key], targetNode[key])
    })
    return
  }
  const segments = targetNode.url.split('/')

  for (let i = 0; i < segments.length - 1; i++) {
    if (kode === 'NA') console.log('NONONO')
    const subKey = segments[i]
    if (!tre[subKey]) tre[subKey] = {}
    tre = tre[subKey]
  }

  const leafKey = segments[segments.length - 1]
  if (kode === 'NA') {
    console.log('leafkey', leafKey)
    console.log('tre', JSON.stringify(Object.keys(tre)))
    console.log('node', JSON.stringify(Object.keys(node)))
  }
  //  if (tre[leafKey]) log.w('Duplicate key ' + leafKey)

  tre[leafKey] = Object.assign({}, tre[leafKey], targetNode)
}

function injectAlias(from, targetNode, tre) {
  for (let i = 0; i < from.length - 1; i++) {
    const subKey = from[i]
    if (!tre[subKey]) tre[subKey] = {}
    tre = tre[subKey]
    if ('$#[]/.'.indexOf(subKey) >= 0) throw new Error(JSON.stringify(from))
    if (!subKey) throw new Error(JSON.stringify(from))
  }
  const leafKey = from[from.length - 1]
  if ('$#[]/.'.indexOf(leafKey) >= 0) throw new Error(JSON.stringify(from))
  if (!leafKey) throw new Error(JSON.stringify(from))
  if (!tre[leafKey]) tre[leafKey] = {}
  const leafNode = tre[leafKey]
  if (!leafNode.se) leafNode.se = {}
  if (targetNode.kode && '$#[]/.'.indexOf(targetNode.kode) >= 0)
    throw new Error(JSON.stringify(from))
  if (!targetNode.kode) throw new Error(JSON.stringify(from))
  leafNode.se[targetNode.kode] = {
    tittel: targetNode.tittel,
    url: targetNode.url
  }
}

function injectKodeAliases(tre) {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    const kodePath = koder.splittKode(kode)
    if (node.url !== kodePath.join('/')) {
      injectAlias(kodePath, node, tre)
    }
  })
}

let acc = {}
function injectNamedAlias(tre, node, tittel) {
  if (!tittel) return
  const kodePath = koder.medGyldigeTegn(tittel) //.split('_')
  kodePath.split('').forEach(c => {
    if (!acc[c]) acc[c] = 1
    else acc[c] = acc[c] + 1
  })
  if (kodePath.length === 0) throw new Error(tittel)
  if (node.url !== kodePath) {
    injectAlias([kodePath], node, tre)
  }
}
function injectNamedAliases(tre) {
  Object.keys(data).forEach(kode => {
    const node = data[kode]
    injectNamedAlias(tre, node, node.tittel.nb)
    injectNamedAlias(tre, node, node.tittel.la)
  })
}

const invalid = '$#[]/.'.split('')
function validateKeys(tre, path) {
  if (tre instanceof Object && tre.constructor === Object)
    Object.keys(tre).forEach(key => {
      const newPath = path + ' ' + key
      if (!newPath) console.log('####', path)
      invalid.forEach(c => {
        if (key.indexOf(c) >= 0) console.log('==========', newPath)
      })
      if (!key) console.log('!!!!!!', path, Object.keys(tre))
      validateKeys(tre[key], newPath)
    })
  if (Array.isArray(tre)) {
    tre.forEach(item => validateKeys(item, path + '[]'))
  }
}

let tre = {}
let node = byggTreFra(tre, config.rotkode)
//console.log(node['@'])
//console.log(tre['~']['@'])
//tre[config.rotkode] = node
injectKodeAliases(tre)
injectNamedAliases(tre)
//console.log(JSON.stringify(byggTreFra('AR_Animalia_Chordata_Tunicata')))
//console.log('NA_T44', nøstOppForfedre(['NA_T44']))
//console.log(r['NA']['T']['1'])
//console.log(r['@'])
//console.log(r.AR['@'])
io.writeJson(config.datafil.metabase, tre)
//console.log(data['AR']['Animalia']['Chordata']['Tunicata'])
//console.log(Object.keys(data['AR']))

validateKeys(tre, '')
//console.log(acc)
