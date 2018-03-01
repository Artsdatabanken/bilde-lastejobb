const io = require('./lib/io')
const config = require('./config')

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

function kode(c) {
  return config.prefix.taxon + c.ScientificNameId
  //  return codePrefix + c.ScientificNameId.toString(36).toUpperCase()
}

let taxons = io.readJson(config.datakilde.taxons)
taxons.unshift({
  TaxonId: 0,
  ScientificNameId: 0,
  ScientificName: 'Biota',
  PopularName: 'Liv'
})

let c2p = {}
taxons.forEach(taxon => {
  c2p[taxon.TaxonId] = taxon.ParentTaxonId
})

let taxonId2Kode = {}
taxons.forEach(c => {
  taxonId2Kode[c.TaxonId] = kode(c)
})

let koder = {}
taxons.forEach(c => {
  const e = {
    kode: kode(c),
    tittel: {}
  }
  if (c.PopularName) e.tittel.nb = capitalizeFirstLetter(c.PopularName)
  e.tittel.la = c.ScientificName
  e.navnSciId = c.ScientificNameId
  e.taxonId = c.TaxonId
  e.taxonIdParent = c.ParentTaxonId
  e.relasjon = []
  e.barn = {}
  e.forelder = taxonId2Kode[c.ParentTaxonId]
  e.infoUrl = 'https://artsdatabanken.no/Taxon/x/' + c.ScientificNameId
  if (c.NatureAreaTypeCodes)
    e.relasjon.push(...c.NatureAreaTypeCodes.map(k => 'NA_' + kode))
  if (c.BlacklistCategory) e.relasjon.push('SL_' + c.BlacklistCategory)
  if (c.RedlistCategories)
    e.relasjon.push(...c.RedlistCategories.map(kode => 'RL_' + kode))
  koder[e.kode] = e
})

const output = koder

io.writeJson(config.datafil.taxon_50, output)
console.log('Importert ' + Object.keys(output).length + ' taxons')
