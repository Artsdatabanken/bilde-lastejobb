const io = require('./lib/io')
const config = require('./config')
const { erKartleggingsnivå } = require('./lib/koder')

let grunntyper = io.readJson(config.datafil.nin_grunntyper)
let foreldre = {}

function harSammeGrunntyper(ckode, ekode) {
  let cgt = grunntyper[ckode].sort()
  let egt = grunntyper[ekode].sort()
  for (let kode of cgt) if (!egt.includes(kode)) return false
  return true
}

function link(ckode) {
  let ekoder = []
  for (ekode of Object.keys(grunntyper)) {
    if (ekode.match(/-E-/gi))
      if (harSammeGrunntyper(ckode, ekode)) {
        ekoder.push(ekode)
      }
  }
  foreldre[ckode] = ekoder
  //  console.log(ckode + '\t' + ekoder.join('\t'))
}

for (let ckode of Object.keys(grunntyper)) {
  if (ckode.match(/-C-/gi)) {
    link(ckode)
    for (let grunntype of grunntyper[ckode]) foreldre[grunntype] = [ckode]
  }
}

io.writeJson(config.datafil.nin_hierarki_overrides, foreldre)
