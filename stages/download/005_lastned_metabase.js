const { http, log } = require("lastejobb");

http
  .downloadBinary(
    `https://data.test.artsdatabanken.no/metadata_med_undertyper.json`,
    "metadata_med_undertyper.json"
  )
  .catch(err => {
    log.fatal(err);
  });
