const fs = require("fs");
const path = require("path");
const io = require("./lib/io");
const config = require("./config");
const log = require("./lib/log");

const sourcePath = "../image/la";
const destPath = "../image/source/";
const files = fs.readdirSync(sourcePath); //input/la/");
files.forEach(fn => {
  if (!fn.startsWith("LA_")) return;
  const spar = fn.split("_");
  const dest = path.join(
    destPath,
    "NN-LA-" + fn[3] + "-" + fn[4] + "-" + spar[2] + ".jpg"
  );
  if (fs.existsSync(dest)) debugger;
  const src = path.join(sourcePath, fn);
  fs.copyFileSync(src, dest);
});
