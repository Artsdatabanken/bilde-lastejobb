const { http, log } = require("lastejobb");

function download(url, filename) {
  http.downloadBinary(url, filename).catch(err => {
    log.fatal(err);
  });
}

download(
  "https://raw.githubusercontent.com/Artsdatabanken/nin-egenskapsdata/master/Natur_i_Norge/Landskap/bilder_som_gjenbrukes.csv",
  "landskap_bilder_som_gjenbrukes.csv"
);
