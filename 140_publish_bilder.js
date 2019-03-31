const io = require("./lib/io");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { spawnSync } = require("child_process");

var data = io.readJson(config.datakilde.metabase);

const imagePath = config.imagePath.processed + "/";
const widths = [408, 950];

Object.keys(data).forEach(kode => {
  if (kode.startsWith("LA")) debugger;
  const node = data[kode];
  widths.forEach(width => {
    deploy("png", node, width);
    deploy("jpg", node, width);
  });
});

function deploy(ext, { kode, url }, width) {
  const fn = path.join(imagePath + width, kode + "." + ext);
  debugger;
  if (!fs.existsSync(fn)) return;
  console.log(
    `scp "${fn}" "grunnkart@hydra:~/tilesdata/${url}/forside_${width}.${ext}"`
  );
}
