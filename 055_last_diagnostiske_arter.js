const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')
const { kodkode, splittKode, lookup } = require('./lib/koder')
const { artskode } = require('./lib/koder')

let diagArt = io.readJson(config.datakilde.nin_diagnostisk_art)
let arter = io.readJson(config.datafil.taxon_50).data
let nin_liste = io.readJson(config.datafil.nin_liste).data

let r = {}

function linkOne(kodeFra, kodeTil, funksjon, tag) {
  const variabel = funksjon
    .replace(tag, '')
    .replace('[', '')
    .replace(']', '')

  if (!r[kodeFra]) r[kodeFra] = { relasjon: {} }
  const relasjon = r[kodeFra].relasjon
  if (!relasjon[tag]) relasjon[tag] = {}
  relasjon[tag][kodeTil] = { variabel: variabel }
}

function linkBoth(kode1, kode2, funksjon, tag) {
  if (!tag) return
  if (!funksjon) return
  tag = tag.trim()
  funksjon = funksjon.trim()
  linkOne(kode1, kode2, funksjon, tag)
  linkOne(kode2, kode1, funksjon, tag)
}

let ukjenteKoder = {}
diagArt.forEach(art => {
  const hovedtype =
    config.prefix.natursystem + art.Kartleggingsenhet.split('-')[0]
  const na_kode = config.prefix.natursystem + art.Kartleggingsenhet.trim()
  if (!nin_liste[na_kode])
    ukjenteKoder[na_kode] = ukjenteKoder[na_kode]
      ? ukjenteKoder[na_kode] + 1
      : 1
  else {
    const idkode = artskode(art.scientificNameID, art.Scientificname)
    console.log(idkode)
    if (arter[idkode]) {
      const tx_kode = arter[idkode].se
      let e = {}
      linkBoth(na_kode, tx_kode, art['Funksjon1'], art['tags1'])
      linkBoth(na_kode, tx_kode, art['Funksjon2'], art['tags2'])
      linkBoth(na_kode, tx_kode, art['Funksjon3'], art['tags3'])
      linkBoth(na_kode, tx_kode, art['Funksjon 4'], art['tags4'])
    } else log.w('Fant ikke ' + idkode)
  }
})

console.warn('Ukjente koder', ukjenteKoder)
io.writeJson(config.datafil.nin_diagnostisk_art, r)
