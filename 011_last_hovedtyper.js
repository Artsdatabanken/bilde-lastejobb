const config = require('./config')
const { readJson, writeJson } = require('./lib/io')

let hovedtyper = readJson(config.datakilde.nin_hovedtyper)
let mi = readJson(config.datafil.nin_variasjon_importert)

function fromCsv(csv) {
  csv = csv.trim()
  if (!csv) return []
  return csv.split(',').map(kode => config.prefix.miljøvariabel + kode)
}

r = {}
hovedtyper.forEach(ht => {
  let me = {}
  me.nivå = 'hovedtype'
  const hg = parseInt(ht['Kunnskapsgrunnlag - Hovedtypen generelt'])
  const gi = parseInt(ht['Kunnskapsgrunnlag - Grunntypeinndelingen'])
  me.kunnskap = {
    inndeling: {
      kode: config.prefix.kunnskap + '-GI' + gi,
      verdi: gi
    },
    generelt: {
      kode: config.prefix.kunnskap + hg,
      verdi: hg
    }
  }
  me.lkm = {
    d: fromCsv(ht.dLKM),
    h: fromCsv(ht.hLKM),
    t: fromCsv(ht.tLKM),
    u: fromCsv(ht.uLKM)
  }
  me.definisjonsgrunnlag = {}
  me.definisjonsgrunnlag.kode =
    config.prefix.definisjonsgrunnlag + ht['GrL'].trim()
  me.definisjonsgrunnlag.tittel = { nb: ht['Definisjonsgrunnlag-tekst'] }
  me.definisjonsgrunnlag.undertittel = { nb: ht['Definisjonsgrunnlag'] }
  me.prosedyrekategori = {}
  me.prosedyrekategori.kode = config.prefix.prosedyrekategori + ht['PrK']
  me.prosedyrekategori.tittel = { nb: ht['PrK-tekst'].trim() }
  me.prosedyrekategori.undertittel = { nb: ht['Prosedyrekategori'] }
  me.nin1 = ht['NiN[1] ']
  r[config.prefix.natursystem + ht.HTK] = me
})

writeJson(config.datafil.nin_hovedtyper, r)
