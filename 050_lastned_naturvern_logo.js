const { http, log } = require("lastejobb");
const config = require("./config");

// Logo for verneområder
http
  .downloadBinary(
    "https://raw.githubusercontent.com/Artsdatabanken/naturvern/master/logo/24px.svg",
    "logo/VV.svg"
  )
  .catch(err => {
    log.fatal(err);
  });
