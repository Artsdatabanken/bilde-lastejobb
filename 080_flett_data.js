const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')

r = {}

function flett(jsonPath) {
  var data = io.readJson(jsonPath).data
  for (let key of Object.keys(data)) {
    r[key] = Object.assign({}, r[key], data[key])
  }
}

function flettHvisEksisterer(jsonPath) {
  var data = io.readJson(jsonPath).data
  for (let key of Object.keys(data)) {
    if (r[key]) Object.assign(r[key], data[key])
  }
}

let counts = {}

function settHvisEksisterer(kilde, mål, nøkkel) {
  if (!kilde[nøkkel]) return
  mål[nøkkel] = kilde[nøkkel]
}

skipped = []
function flettCustom(jsonPath) {
  var data = io.readJson(jsonPath).data
  Object.keys(data).forEach(key => {
    const src = data[key]
    const dst = r[key]
    if (!dst) {
      skipped.push(key)
    } else {
      if (src.beskrivelse) src.ingress = src.beskrivelse
      settHvisEksisterer(src, dst, 'ingress')
      settHvisEksisterer(src, dst, 'bin')
      settHvisEksisterer(src, dst, 'relasjon')
      settHvisEksisterer(src, dst, 'statistikk')
      Object.keys(src).forEach(key => {
        if (!counts[key]) counts[key] = 0
        counts[key]++
      })
    }
  })
  console.log('=====counts====')
  console.log(counts)
}

flett(config.datafil.fylke_61)
flett(config.datafil.kommune_60)
flett(config.datafil.nin_diagnostisk_art)
flett(config.datafil.nin_grunntyper)
flett(config.datafil.nin_hovedtyper)
flett(config.datafil.nin_liste)
flett(config.datafil.nin_variasjon_importert)
flett(config.datafil.taxon_50)
flett(config.datafil.andre_koder)
flettHvisEksisterer(config.datafil.bbox_30)
flettCustom(config.datafil.metagammel)

for (let key of Object.keys(r)) {
  const node = r[key]
  if (!node.se) {
    if (!r[key].tittel) log.w('Mangler tittel: ', key)
    if (!r[key].kode) log.w('Mangler kode: ', key)
  }
}

hash = {}
Object.keys(r).forEach(key => {
  const node = r[key]
  if (!node.se) {
    if (!node.tittel) console.log(node)
    const tittel = node.tittel.nb || node.tittel.la
    if (!hash[tittel]) hash[tittel] = []
    else hash[tittel].push(key)
  }
})

console.log(JSON.stringify(r['NA_M11'].definisjonsgrunnlag))
console.log(JSON.stringify(r['sqrt(42)']))
io.writeJson(config.datafil.flettet, r)
