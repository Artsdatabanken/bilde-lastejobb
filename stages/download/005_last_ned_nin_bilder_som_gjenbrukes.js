const { http, log } = require("@artsdatabanken/lastejobb");

function download(url, filename) {
  http.downloadBinary(url, filename).catch(err => {
    log.fatal(err);
  });
}

download(
  "https://raw.githubusercontent.com/Artsdatabanken/natursystem-ubehandlet/master/bilder_som_gjenbrukes.csv",
  "landskap_bilder_som_gjenbrukes.csv"
);
