const config = {
  rotkode: '~',
  datakilde: {
    nin_koder: 'http://webtjenester.artsdatabanken.no/NiN/v2b/koder/alleKoder',
    nin_variasjon:
      'http://webtjenester.artsdatabanken.no/NiN/v2b/variasjon/alleKoder',
    nin_hovedtyper: '../input/hovedtyper.json',
    nin_diagnostisk_art: '../input/diagnostiske arter.json',
    nin_api_graf: 'https://www.artsdatabanken.no/api/graph/NiN2.0/',
    bbox: '../input/bbox.json',
    taxons: '../input/taxons.json',
    taxon_adb_photos: '../input/scientificNameId-fileId.txt',
    obsoletemetabase: '../input/grunnkart-export.json'
  },
  datafil: {
    nin_koder: '../data/nin_koder.json',
    nin_variasjon: '../data/nin_variasjon.json',
    nin_grunntyper: '../data/nin_grunntyper.json',
    nin_hovedtyper: '../data/nin_hovedtyper.json',
    nin_prosedyrekategori: '../data/nin_prosedyrekategori.json',
    nin_definisjonsgrunnlag: '../data/nin_definisjonsgrunnlag.json',
    nin_koder_importert: '../data/nin_koder_importert.json',
    nin_variasjon_importert: '../data/nin_variasjon_importert.json',
    nin_liste: '../data/nin_liste.json',
    nin_foto: '../data/nin_foto.json',
    bbox_30: '../data/bbox_30.json',
    nin_hierarki_overrides: '../data/nin_hierarki_overrides.json',
    taxon_50: '../data/taxon_50.json',
    kommune_60: '../data/kommune_60.json',
    fylke_61: '../data/fylke_61.json',
    nin_diagnostisk_art: '../data/nin_diagnostisk_art.json',
    andre_koder: '../data/andre_koder.json',
    organisasjon: '../data/organisasjon.json',
    våpenskjold_meta: '../data/110_våpenskjold_meta.json',
    dominant_farge: '../data/dominant_farge.json',
    farger: '../data/farger.json',
    flettet: '../data/flettet.json',
    metabase: '../data/metabase.json',
    kodetre: '../data/kodetre.json',
    koder_med_forfedre: '../data/koder_med_forfedre.json',
    metagammel: '../data/metagammel.json'
  },
  imagePath: {
    source: '../image/source',
    processed: '../image/processed',
    custom_avatar: '../input/avatar',
    custom_omslag: '../input/omslag'
  },
  prefix: {
    natursystem: 'NA_',
    miljøvariabel: 'MI_',
    taxon: 'AR_',
    fremmedArt: 'FA_',
    truet: 'RL_',
    administrativtOmråde: 'AO_',
    definisjonsgrunnlag: 'NA_HT-DG',
    prosedyrekategori: 'NA_HT-PK',
    kunnskap: 'NA_HT-KG'
  },
  infoUrl: {
    nin: 'https://www.artsdatabanken.no/NiN2.0/'
  },
  cachePath: '../cache',
  getCachePath: function(relPath) {
    return this.cachePath + '/' + relPath + '/'
  }
}

const isDebug = true
if (!isDebug) console.log = function() {}

function log(...args) {
  console.log.apply(this, args)
  return args
}

module.exports = config
