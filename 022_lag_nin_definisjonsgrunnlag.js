const config = require('./config')
const { readJson, writeJson } = require('./lib/io')

let hovedtyper = readJson(config.datafil.nin_hovedtyper)

r = {}

Object.keys(hovedtyper).forEach(kode => {
  const hovedtype = hovedtyper[kode]
  const dg = hovedtype.definisjonsgrunnlag
  const pkkode = dg.kode
  if (!r[pkkode])
    r[pkkode] = {
      foreldre: [config.prefix.definisjonsgrunnlag],
      kode: kode,
      tittel: dg.tittel,
      undertittel: {
        nb: 'Definisjonsgrunnlag'
      },
      barn: []
    }

  r[pkkode].barn.push(kode)
})

writeJson(config.datafil.nin_definisjonsgrunnlag, r)
