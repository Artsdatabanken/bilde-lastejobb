const io = require('./lib/io')
const config = require('./config')

r = {}

function flett(jsonPath) {
  var data = io.readJson(jsonPath)
  Object.assign(r, data)
}

flett(config.datafil.bbox_30)
flett(config.datafil.fylke_61)
flett(config.datafil.kommune_60)
flett(config.datafil.nin_diagnostisk_art)
flett(config.datafil.nin_grunntyper)
flett(config.datafil.nin_hovedtyper)
flett(config.datafil.nin_liste)
flett(config.datafil.nin_variasjon_importert)
flett(config.datafil.taxon_50)
flett(config.datafil.andre_koder)

io.writeJson(config.datafil.flettet, r)
console.log('Flettet ' + Object.keys(r).length + ' koder')
