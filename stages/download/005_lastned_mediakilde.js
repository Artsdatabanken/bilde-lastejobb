const { http, log } = require("lastejobb");

// Pekere til bilder
http
  .downloadBinary(
    `http://data.artsdatabanken.no/mediakilde.json`,
    "mediakilde.json"
  )
  .catch(err => {
    log.fatal(err);
  });
