const io = require('./lib/io')
const config = require('./config')
const { kodkode, splittKode, lookup } = require('./lib/koder')

let arter = io.readJson(config.datakilde.nin_diagnostisk_art)

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

arter.forEach(art => {
  const hovedtype =
    config.prefix.natursystem + art.Kartleggingsenhet.split('-')[0]
  const na_kode = config.prefix.natursystem + art.Kartleggingsenhet

  const tx_kode = config.prefix.taxon + parseInt(art.scientificNameID)
  let e = {}
  linkBoth(na_kode, tx_kode, art['Funksjon1'], art['tags1'])
  linkBoth(na_kode, tx_kode, art['Funksjon2'], art['tags2'])
  linkBoth(na_kode, tx_kode, art['Funksjon3'], art['tags3'])
  linkBoth(na_kode, tx_kode, art['Funksjon 4'], art['tags4'])
})

console.log('Importert ' + Object.keys(r).length + ' NiN koder')
io.writeJson(config.datafil.nin_diagnostisk_art, r)
