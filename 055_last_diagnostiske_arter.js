const io = require('./lib/io')
const log = require('./lib/log')
const config = require('./config')
const { kodkode, splittKode, lookup } = require('./lib/koder')
const koder = require('./lib/koder')

let diagArt = io.readJson(config.datakilde.nin_diagnostisk_art)
let arter = io.readJson(config.datafil.taxon_50)
let nin_liste = io.readJson(config.datafil.nin_liste)

let r = {}

function linkOne(nodeFra, nodeTil, funksjon, tag) {
  const variabel = funksjon
    .replace(tag, '')
    .replace('[', '')
    .replace(']', '')

  const kodeFra = nodeFra.kode
  const kodeTil = nodeTil.kode
  if (!r[kodeFra]) r[kodeFra] = { relasjon: {} }
  const relasjon = r[kodeFra].relasjon
  if (!relasjon[tag]) relasjon[tag] = {}
  relasjon[tag][kodeTil] = {
    kode: kodeTil,
    tittel: nodeTil.tittel,
    variabel: variabel
  }
}

function linkBoth(node1, node2, funksjon, tag) {
  if (!tag) return
  if (!funksjon) return
  tag = tag.trim().replace(' ', '_')
  funksjon = funksjon.trim()
  linkOne(node1, node2, funksjon, tag)
  linkOne(node2, node1, funksjon, tag)
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
    const idkode = koder.artskode(art.scientificNameID, art.Scientificname)
    if (arter[idkode]) {
      //      const tx_kode = arter[idkode].se
      const na = nin_liste[na_kode]
      tx = arter[idkode]
      if (tx.se) tx = arter[tx.se]
      let e = {}
      linkBoth(na, tx, art['Funksjon1'], art['tags1'])
      linkBoth(na, tx, art['Funksjon2'], art['tags2'])
      linkBoth(na, tx, art['Funksjon3'], art['tags3'])
      linkBoth(na, tx, art['Funksjon 4'], art['tags4'])
    } else log.w('Fant ikke art ' + idkode)
  }
})

console.warn('Ukjente koder', ukjenteKoder)
io.writeJson(config.datafil.nin_diagnostisk_art, r)
