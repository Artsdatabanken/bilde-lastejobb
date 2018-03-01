const config = {
  datakilde: {
    nin_koder: 'http://webtjenester.artsdatabanken.no/NiN/v2b/koder/alleKoder',
    nin_variasjon:
      'http://webtjenester.artsdatabanken.no/NiN/v2b/variasjon/alleKoder',
    nin_hovedtyper: 'input/hovedtyper.json',
    nin_diagnostisk_art: 'input/diagnostiske arter.json',
    nin_api_graf: 'https://www.artsdatabanken.no/api/graph/NiN2.0/',
    bbox: 'input/bbox.json',
    taxons: 'input/taxons.json'
  },
  datafil: {
    nin_koder: 'data/nin_koder.json',
    nin_variasjon: 'data/nin_variasjon.json',
    nin_grunntyper: 'data/nin_grunntyper.json',
    nin_hovedtyper: 'data/nin_hovedtyper.json',
    nin_koder_importert: 'data/nin_koder_importert.json',
    nin_variasjon_importert: 'data/nin_variasjon_importert.json',
    nin_liste: 'data/nin_liste.json',
    kodetre_30: 'data/kodetre_30.json',
    nin_hierarki_overrides: 'data/nin_hierarki_overrides.json',
    taxon_50: 'data/taxon_50.json',
    kommune_60: 'data/kommune_60.json',
    fylke_61: 'data/fylke_61.json',
    nin_diagnostisk_art: 'data/nin_diagnostisk_art.json',
    andre_koder: 'data/andre_koder.json',
    flettet: 'data/flettet.json',
    metabase: 'data/metabase.json'
  },
  prefix: {
    natursystem: 'NA_',
    taxon: 'TX_',
    administrativtOmråde: 'AO_'
  }
}

module.exports = config
