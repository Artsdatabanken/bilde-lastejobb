const config = {
  rotkode: "~",
  datakilde: {
    nin_koder: "http://webtjenester.artsdatabanken.no/NiN/v2b/koder/alleKoder",
    nin_variasjon:
      "http://webtjenester.artsdatabanken.no/NiN/v2b/variasjon/alleKoder",
    nin_hovedtyper: "../input/hovedtyper.json",
    nin_diagnostisk_art: "../input/diagnostiske arter.json",
    nin_api_graf: "https://www.artsdatabanken.no/api/graph/NiN2.0/",
    bbox: "../input/bbox.json",
    taxons: "../input/taxons.json",
    taxon_adb_photos: "../input/scientificNameId-fileId.txt",
    metabase: "./data/metadata_med_undertyper.json"
  },
  datafil: {
    nin_liste: "../data/nin_liste.json",
    artsfoto: "../data/artsfoto.json",
    nin_foto: "../data/nin_foto.json",
    taxon_50: "../data/taxon_50.json"
  },
  prefix: {
    natursystem: "NA_",
    miljøvariabel: "MI_",
    taxon: "AR_",
    fremmedArt: "FA_",
    truet: "RL_",
    administrativtOmråde: "AO_",
    definisjonsgrunnlag: "NA_HT-DG",
    prosedyrekategori: "NA_HT-PK",
    kunnskap: "NA_HT-KG"
  },
  infoUrl: {
    nin: "https://www.artsdatabanken.no/NiN2.0/"
  },
  cachePath: "../cache",
  dataPath: "../data",
  getCachePath: function(relPath) {
    return this.cachePath + "/" + relPath + "/";
  },
  getDataPath: function(relPath) {
    return this.dataPath + "/" + relPath + "/";
  }
};

const isDebug = true;
if (!isDebug) console.log = function() {};

module.exports = config;
