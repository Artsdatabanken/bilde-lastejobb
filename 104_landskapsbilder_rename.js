const fs = require("fs");
const path = require("path");

const destPath = "../image/source/";

//rename("../image/la/fradrupal");
rename("../../bilder/landskap/landskapstype");
rename("../../bilder/landskap/landskapsgradient");

function rename(sourcePath) {
  const files = fs.readdirSync(sourcePath); //input/la/");
  files.forEach(fn => {
    const ufn = fn.toUpperCase();
    if (!ufn.startsWith("LA")) return;
    const destFn = mapTilKode(ufn) + path.extname(ufn).toLowerCase();
    const dest = path.join(destPath, destFn);
    if (fs.existsSync(dest)) return;
    debugger;
    const src = path.join(sourcePath, fn);
    fs.copyFileSync(src, dest);
  });
}

function mapTilKode(fn) {
  const ufn = fn.toUpperCase();
  const spar = ufn.replace("_", "-").split("-");
  if (fn.indexOf("REIDKF") > 0) debugger;
  if (spar[1] === "KLG") return "NN-LA-KLG-" + spar[2];
  let dfn = "NN-LA-TI-" + ufn[3] + "-" + ufn[4];
  if (parseInt(spar[2]) > 0) dfn += "-" + spar[2];
  return dfn;
}
