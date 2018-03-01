const fs = require('fs')
const path = require('path')
const { splittKode } = require('./lib/koder')
const { readJson, writeJson } = require('./lib/io')

let db = readJson('../input/v2.json')
let hovedtyper = readJson('../input/nin/hovedtyper.json')

let na = db.NA

function fromCsv(csv) {
  csv = csv.trim()
  if (!csv) return []
  return csv.split(',')
}

hovedtyper.forEach(ht => {
  const path = splittKode(ht.HTK)
  let node = na[path[0]][path[1]]
  if (!node) console.log(ht.HTK)
  let me = node['@']
  if (me.tittel !== ht.Navn) console.log(me.kode, me.tittel, ht.Navn)
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
  me.definisjonsgrunnlag[parseInt(ht['GrL'])] = ht['Definisjonsgrunnlag-tekst']
  me.prosedyrekategori = {}
  me.prosedyrekategori[ht['PrK']] = ht['PrK-tekst']
  me.nin1 = ht['NiN[1] ']
  console.log(ht.uLKM)
  console.log(JSON.stringify(me))
})

writeJson('nydb.json', db)
