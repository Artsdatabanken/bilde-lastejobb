const io = require("./lib/io");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const { spawnSync } = require("child_process");

var data = io.readJson(config.datakilde.metabase);

const imagePath = config.imagePath.processed + "/kode/408";
Object.keys(data).forEach(kode => {
  const fn = path.join(imagePath, kode + ".jpg");
  const node = data[kode];
  if (fs.existsSync(fn))
    console.log(
      `scp "${fn}" "grunnkart@hydra:~/tilesdata/${node.url}/forside_408.jpg"`
    );
});
