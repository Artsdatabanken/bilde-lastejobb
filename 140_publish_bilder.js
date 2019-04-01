const io = require("./lib/io");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { spawnSync } = require("child_process");

var data = io.readJson(config.datakilde.metabase);

const imagePath = config.imagePath.processed + "/";
const widths = [408, 950];

Object.keys(data).forEach(kode => {
  const node = data[kode];
  const foto = node.foto;
  widths.forEach(width => {
    deploy("png", node, width, foto);
    deploy("jpg", node, width, foto);
  });
});

function deploy(ext, { kode, url }, width, foto) {
  const fn = path.join(imagePath + width, kode + "." + ext);
  if (!fs.existsSync(fn)) return;
  const destFn = `forside_${width}.${ext}`;
  if (foto.forside && foto.forside.url.indexOf(destFn) >= 0) return;
  if (foto.banner && foto.banner.url.indexOf(destFn) >= 0) return;
  console.log(`scp "${fn}" "grunnkart@hydra:~/tilesdata/${url}/${destFn}"`);
}
