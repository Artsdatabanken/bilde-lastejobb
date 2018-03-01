const fs = require('fs')
const path = require('path')
const { kodkode, splittKode, lookup } = require('./lib/koder')

function readJson(filePath) {
  const data = fs.readFileSync(filePath)
  return (json = JSON.parse(data))
}

let db = readJson('../input/v2.json')
let arter = readJson('../input/nin/diagnostiske arter.json')

function nyKode(db, kode, tittel) {
  const node = lookup(db, kode)
  node['@'].tittel = tittel
  const parent = lookup(db, node['@'].forelder.kode)
  if (!parent['@'].barn) parent['@'].barn = {}
  if (!parent['@'].barn[kode]) parent['@'].barn[kode] = { tittel: tittel }
}

nyKode(db, 'RL_EN', 'Sterkt truet')
nyKode(db, 'RL_VU', 'Sårbar')
nyKode(db, 'RL_RE', 'Regionalt utdødd')
nyKode(db, 'RL_NT', 'Nær truet')
nyKode(db, 'RL_NA', 'Ikke vurdert')
nyKode(db, 'RL_DD', 'Datamangel')
nyKode(db, 'FA', 'Fremmed art')
nyKode(db, 'FA_SE', 'Svært høy risiko')
nyKode(db, 'FA_HI', 'Høy risiko')
nyKode(db, 'FA_PH', 'Potensielt høy risiko')
nyKode(db, 'FA_LO', 'Lav risiko')
nyKode(db, 'FA_NK', 'Ingen kjent risiko')
nyKode(db, 'LI', 'Livsmedium')
nyKode(db, 'LI_MS', 'Substrat i marine systemer')
nyKode(db, 'LI_MS-M7', 'Dødt plantemateriale i marine systemer')
nyKode(db, 'LI_TS', 'Substrat på land')
nyKode(db, 'LI_TS-T3', 'Organisk jord')
nyKode(db, 'LI_TS-T4', 'Levende planter på land')
nyKode(db, 'LI_TS-T6', 'Ved-livsmedier')
nyKode(db, 'LI_TS-T10', 'Dødt plantemateriale')
nyKode(db, 'LI_TS-T10_M7', 'Dødt plantemateriale i marine systemer ')

function expand(kode) {
  kode = kode.replace(' ', '_')
  kode = kode.replace('SL_', 'FA_')
  if (kode.length < 3 || kode[2] != '_') kode = 'NA_' + kode
  return kode
}

function set(r, tag, kode) {
  const node = lookup(db, kode)
  if (!r[tag]) r[tag] = {}
  //  if (!node['@'].tittel) console.log('missing:', kode)
  r[tag][kode] = { tittel: node['@'].tittel }
}

function inject(r, kode) {
  kode = expand(kode)
  const prefix = kode.substring(0, 2)
  switch (prefix) {
    case 'NA':
      set(r, 'naturtype', kode)
      break
    case 'LI':
      set(r, 'livsmedium', kode)
      break
    case 'FA':
      set(r, 'fremmed', kode)
      break
    case 'RL':
      set(r, 'truet', kode)
      break
    default:
      throw new Error('Ukjent kode: ' + kode)
  }
}

function port(rel) {
  let r = {}
  if (!Array.isArray(rel)) return r
  rel.forEach(kode => {
    inject(r, kode)
  })
  return r
}

let count = 0
function cleanRelasjon(parent) {
  Object.keys(parent).forEach(c => {
    if (c !== '@') {
      node = parent[c]
      cleanRelasjon(node)
      const nodeat = node['@']
      if (nodeat) {
        let me = nodeat
        const hasRel = me.relasjon
        me.relasjon = port(me.relasjon)
        if (nodeat.kode === 'TX_27JJ') {
          console.log('###', JSON.stringify(nodeat))
        }
        count++
      }
    }
  })
}

console.log(count)
cleanRelasjon(db.TX)

let na = db.NA

function fromCsv(csv) {
  csv = csv.trim()
  if (!csv) return []
  return csv.split(',')
}

function link(taxon, kartleggingsenhet, funksjon, tag) {
  if (!tag) return
  if (!funksjon) return
  tag = tag.trim()
  funksjon = funksjon.trim()
  const variabel = funksjon
    .replace(tag, '')
    .replace('[', '')
    .replace(']', '')
  if (!kartleggingsenhet.relasjon) kartleggingsenhet.relasjon = {}
  const relasjon = kartleggingsenhet.relasjon
  if (!relasjon[tag]) relasjon[tag] = {}
  relasjon[tag][taxon.kode] = { tittel: taxon.tittel, variabel: variabel }

  if (!taxon.relasjon) taxon.relasjon = {}
  const trelasjon = taxon.relasjon
  if (!trelasjon[tag]) trelasjon[tag] = {}
  trelasjon[tag][kartleggingsenhet.kode] = variabel
}

let log = true
arter.forEach(art => {
  const hovedtype = 'NA_' + art.Kartleggingsenhet.split('-')[0]
  const kode = 'NA_' + art.Kartleggingsenhet
  const path = splittKode(kode)
  let kartleggingsenhet = lookup(db, art.Kartleggingsenhet)
  let kartleggingsenhetat = kartleggingsenhet['@']
  kartleggingsenhetat.kode = kode
  kartleggingsenhet.forelder = { kode: hovedtype }
  let parent = lookup(db, hovedtype)
  let parentat = parent['@']
  const suffix = kode.replace(hovedtype + '-', '')
  if (!parentat.barn) parentat.barn = {}
  parentat.barn[suffix] = { kode: kode }

  const sciNameId = parseInt(art.scientificNameID)
  let taxon = lookup(db, kodkode(sciNameId))
  const taxonat = taxon['@']
  if (!taxonat.tittel) taxonat.tittel = art.Scientificname
  if (!taxonat.undertittel) taxonat.undertittel = art.Populærnavn
  link(taxonat, kartleggingsenhetat, art['Funksjon1'], art['tags1'])
  link(taxonat, kartleggingsenhetat, art['Funksjon2'], art['tags2'])
  link(taxonat, kartleggingsenhetat, art['Funksjon3'], art['tags3'])
  link(taxonat, kartleggingsenhetat, art['Funksjon 4'], art['tags4'])
  if (kode == 'NA_T4-C-7' && log) {
    console.log(JSON.stringify(kartleggingsenhet))
    log = false
  }
})

let t4 = lookup(db, 'NA_T4')
console.log(t4['@'])
fs.writeFileSync('nydb.json', JSON.stringify(db))
console.log(kodkode(101585))
