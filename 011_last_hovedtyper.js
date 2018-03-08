const config = require('./config')
const { readJson, writeJson } = require('./lib/io')

let hovedtyper = readJson(config.datakilde.nin_hovedtyper)

function fromCsv(csv) {
  csv = csv.trim()
  if (!csv) return []
  return csv.split(',')
}

r = {}
hovedtyper.forEach(ht => {
  let me = {}
  me.nivå = 'hovedtype'
  me.kunnskap = {
    inndeling: parseInt(ht['Kunnskapsgrunnlag - Grunntypeinndelingen']),
    generelt: parseInt(ht['Kunnskapsgrunnlag - Hovedtypen generelt'])
  }
  me.lkm = {
    d: fromCsv(ht.dLKM),
    h: fromCsv(ht.hLKM),
    t: fromCsv(ht.tLKM),
    u: fromCsv(ht.uLKM)
  }
  me.definisjonsgrunnlag = {}
  me.definisjonsgrunnlag[ht['GrL']] = ht['Definisjonsgrunnlag-tekst']
  me.prosedyrekategori = {}
  me.prosedyrekategori[ht['PrK']] = ht['PrK-tekst']
  me.nin1 = ht['NiN[1] ']
  r[config.prefix.natursystem + ht.HTK] = me
})

writeJson(config.datafil.nin_hovedtyper, r)
