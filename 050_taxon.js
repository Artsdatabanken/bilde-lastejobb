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
  return config.prefix.taxon + artFullStiSub(c)
}
function artFullStiSub(c) {
  if (!c.ParentTaxonId) return c.ScientificName
  return (
    artFullStiSub(taxon2Data[c.ParentTaxonId]) +
    '_' +
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
  const sti = artFullSti(c)
  const kortkode = artskode(c.ScientificNameId, c.ScientificName)
  const sciIdKode = config.prefix.taxon + c.ScientificNameId
  const e = {
    kode: kortkode,
    tittel: {}
  }

  if (c.PopularName) e.tittel.nb = capitalizeFirstLetter(c.PopularName)
  e.tittel.la = c.ScientificName
  e.navnSciId = c.ScientificNameId
  e.taxonId = c.TaxonId
  e.taxonIdParent = c.ParentTaxonId
  e.relasjon = []
  e.foreldre = [forelder(c)]
  //  e.foreldre = alleForeldre(c)
  // e.foreldreAlias = [taxonId2Kode[c.ParentTaxonId]]
  e.infoUrl = 'https://artsdatabanken.no/Taxon/x/' + c.ScientificNameId
  if (c.NatureAreaTypeCodes)
    e.relasjon.push(...c.NatureAreaTypeCodes.map(kode => config.prefix.natursystem + kode))
  if (c.BlacklistCategory)
    e.relasjon.push(config.prefix.fremmedArt + c.BlacklistCategory)
  if (c.RedlistCategories)
    e.relasjon.push(...c.RedlistCategories.map(kode => config.prefix.truet + kode))
  if (kortkode === 'AR_Animalia') console.log(kortkode, e)
  if (sciIdKode === 'AR_Animalia') console.log(kortkode, e)
  koder[sti] = e
  if (sti !== kortkode) koder[kortkode] = { se: sti }
  koder[sciIdKode] = { se: sti }
})

const output = koder
io.writeJson(config.datafil.taxon_50, output)
