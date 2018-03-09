const io = require('./lib/io')
const config = require('./config')
const { artskode, medGyldigeTegn } = require('./lib/koder')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

let taxons = io.readJson(config.datakilde.taxons)

let taxon2Data = {}
taxons.forEach(tx => {
  taxon2Data[tx.TaxonId] = tx
})

let c2p = {}
taxons.forEach(taxon => {
  c2p[taxon.TaxonId] = taxon.ParentTaxonId
})

let taxonId2Kode = {}
taxons.forEach(c => {
  taxonId2Kode[c.TaxonId] = artskode(c.ScientificNameId, c.ScientificName)
})

function artFullSti(c) {
  const sub = artFullStiSub(c)
  if (sub) return 'Biota' + '/' + artFullStiSub(c)
  return 'Biota'
}

function artFullStiSub(c) {
  if (!c.ParentTaxonId) return c.ScientificName
  return (
    artFullStiSub(taxon2Data[c.ParentTaxonId]) +
    '/' +
    medGyldigeTegn(c.ScientificName)
  )
}

function forelder(c) {
  if (c.ParentTaxonId) {
    c = taxon2Data[c.ParentTaxonId]
    return artskode(c.ScientificNameId, c.ScientificName)
  }
  if (c.ParentTaxonId === 0) return config.prefix.taxon.replace('_', '')
  return config.rotkode
}

function alleForeldre(c) {
  let r = []
  while (c.ParentTaxonId) {
    c = taxon2Data[c.ParentTaxonId]
    r.push(artskode(c.ScientificNameId, c.ScientificName))
  }
  r.push(config.prefix.taxon.replace('_', ''))
  return r
}

let koder = {}
taxons.forEach(c => {
  const kode = artskode(c.ScientificNameId, c.ScientificName)
  const e = {
    kode: kode,
    tittel: { la: c.ScientificName },
    navnSciId: c.ScientificNameId,
    taxonId: c.TaxonId,
    taxonIdParent: c.ParentTaxonId,
    relasjon: [],
    foreldre: [forelder(c)],
    infoUrl: 'https://artsdatabanken.no/Taxon/x/' + c.ScientificNameId
  }

  if (c.PopularName) {
    e.tittel.nb = capitalizeFirstLetter(c.PopularName)
  }
  if (c.NatureAreaTypeCodes)
    e.relasjon.push(
      ...c.NatureAreaTypeCodes.map(kode => config.prefix.natursystem + kode)
    )
  if (c.BlacklistCategory)
    e.relasjon.push(config.prefix.fremmedArt + c.BlacklistCategory)
  if (c.RedlistCategories)
    e.relasjon.push(
      ...c.RedlistCategories.map(kode => config.prefix.truet + kode)
    )
  e.url = artFullSti(c)
  koder[kode] = e
})

const output = koder
io.writeJson(config.datafil.taxon_50, output)
