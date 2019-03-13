const io = require("./lib/io");
const config = require("./config");
const log = require("./lib/log");
var deasync = require("deasync");

log.logLevel = 5;

var osmosis = require("osmosis");
const fs = require("fs");

let artsliste = io.readJson(config.datafil.nin_diagnostisk_art);
let r = [];

function hentfotolink(sciNameId, callback) {
  console.log(sciNameId);
  log.d("READ", sciNameId);
  osmosis
    .get("https://artsdatabanken.no/Taxon/x/" + sciNameId)
    .find("picture")
    .set({
      foto: "img@src"
    })
    .data(function(www) {
      let foto = www.foto;
      if (!foto) {
        return callback();
      }
      foto = foto.replace("?mode=320x320", "");
      log.v("Fant foto: ", foto);
      const url = www.foto ? `https://artsdatabanken.no${foto}` : undefined;
      r.push({ sciNameId: sciNameId, foto: url });
      return callback();
    })
    .error(error => {
      log.e(error);
      return callback();
    })
    .log(console.log)
    .debug(log.d);
  //.debug(console.log)
}

function hentfotolinker(artsliste) {
  const keys = Object.keys(artsliste);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (key.indexOf(config.prefix.natursystem) === 0) continue;
    let done = false;
    hentfotolink(key.replace("AR_", ""), () => {
      done = true;
    });
    deasync.loopWhile(function() {
      return !done;
    });
  }
  log.v("Lagrer");
  io.writeJson(config.datafil.artsfoto, r);
  log.v("Ferdig.");
}

//hentfotolinker({ 101825: {} });
hentfotolinker(artsliste);
