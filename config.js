const config = {
  rotkode: "~",
  datakilde: {
    nin_diagnostisk_art: "../input/diagnostiske arter.json",
    taxons: "../input/taxons.json",
    taxon_adb_photos: "../input/scientificNameId-fileId.txt"
  },
  datafil: {
    nin_liste: "data/nin_liste.json",
    artsfoto: "data/artsfoto.json",
    nin_foto: "data/nin_foto.json",
    taxon_50: "data/taxon_50.json"
  },
  prefix: {
    natursystem: "NA_",
    taxon: "AR_"
  }
};

module.exports = config;
