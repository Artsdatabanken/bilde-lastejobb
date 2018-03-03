const io = require('./lib/io')
const config = require('./config')

r = {}

function flett(jsonPath) {
  var data = io.readJson(jsonPath).data
  if (data['NA_T34-C-6']) console.log(data['NA_T34-C-6'])
  Object.assign(r, data)
}

function flettHvisEksisterer(jsonPath) {
  var data = io.readJson(jsonPath)
  for (let kode of Object.keys(data)) {
    if (r[kode]) Object.assign(r[kode], data[kode])
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
  Object.keys(data).forEach(kode => {
    const src = data[kode]
    const dst = r[kode]
    if (!dst) {
      skipped.push(kode)
    } else {
      settHvisEksisterer(src, dst, 'bin')
      settHvisEksisterer(src, dst, 'prosedyrekatetgori')
      settHvisEksisterer(src, dst, 'relasjon')
      settHvisEksisterer(src, dst, 'statistikk')
      settHvisEksisterer(src, dst, 'beskrivelse')
      settHvisEksisterer(src, dst, 'definisjonsgrunnlag')
      settHvisEksisterer(src, dst, 'kunnskap')
      settHvisEksisterer(src, dst, 'lkm')
      settHvisEksisterer(src, dst, 'nin1')
      settHvisEksisterer(src, dst, 'nivå')

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

io.writeJson(config.datafil.flettet, r)
