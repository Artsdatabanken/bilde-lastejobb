const { http, log } = require("lastejobb");

function download(url, filename) {
  http.downloadBinary(url, "logo/" + filename).catch(err => {
    log.fatal(err);
  });
}

download(
  "https://raw.githubusercontent.com/Artsdatabanken/naturvern/master/logo/24px.svg",
  "VV.svg"
);
download(
  "https://raw.githubusercontent.com/Artsdatabanken/nin-egenskapsdata/master/Natur_i_Norge/Landskap/logo.svg",
  "NN-LA.svg"
);
download(
  "https://raw.githubusercontent.com/Artsdatabanken/nin-egenskapsdata/master/Natur_i_Norge/Natursystem/logo.png",
  "NN-NA.png"
);
