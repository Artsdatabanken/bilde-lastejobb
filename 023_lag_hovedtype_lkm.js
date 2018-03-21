const config = require('./config')
const { readJson, writeJson } = require('./lib/io')

let hovedtyper = readJson(config.datafil.nin_hovedtyper)

r = {}

Object.keys(hovedtyper).forEach(kode => {
  const hovedtype = hovedtyper[kode]
  const pk = hovedtype.prosedyrekategori
  const pkkode = pk.kode
  if (!r[pkkode])
    r[pkkode] = {
      foreldre: [config.prefix.prosedyrekategori],
      kode: kode,
      tittel: pk.tittel,
      undertittel: {
        nb: 'Prosedyrekategori'
      },
      barn: []
    }

  r[pkkode].barn.push(kode)
})

writeJson(config.datafil.nin_prosedyrekategori, r)
