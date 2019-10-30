const io = require("./lib/io");
const config = require("./config");
const log = require("./lib/log");

const fotos = io.readJson(config.datafil.artsfoto);

async function download(node) {
  const kode = "AR-" + node.sciNameId;
  const url = node.foto;
  console.log(kode, url);
  const targetFile = config.imagePath.source + "/" + kode + ".jpg";
  if (!io.fileExists(targetFile)) {
    log.v("not in cache", targetFile);
    await io.getBinaryFromCache(url, targetFile);
  }
}

async function downThemAll() {
  for (let i = 0; i < Object.keys(fotos).length; i++) await download(fotos[i]);
}

downThemAll().then(x => log.i(x));
