const { http, log } = require("@artsdatabanken/lastejobb");

function download(url, filename) {
  http.downloadBinary(url, "logo/" + filename).catch(err => {
    log.fatal(err);
  });
}

download(
  "https://raw.githubusercontent.com/Artsdatabanken/naturvern/master/logo/logo.svg",
  "VV.svg"
);
download(
  "https://raw.githubusercontent.com/Artsdatabanken/landskap-ubehandlet/a70627c5fcdef9d55f56eca4197698f9e22d39ef/logo.svg",
  "NN-LA.svg"
);
download(
  "https://github.com/Artsdatabanken/natursystem-ubehandlet/blob/master/logo.png?raw=true",
  "NN-NA.png"
);
