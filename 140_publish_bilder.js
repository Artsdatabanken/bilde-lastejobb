const { io } = require("lastejobb");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const imagePath = config.imagePath.processed + "/";
const widths = [40, 408, 950];

var data = io.readJson(config.datakilde.metabase);

deployFrom("logo");
deployFrom("foto");
deployFrom("banner");

function deployFrom(subdir) {
  Object.keys(data).forEach(kode => {
    const node = data[kode];
    const foto = node.foto;
    widths.forEach(width => {
      const srcPath = path.join(imagePath, subdir, width.toString());
      deploy(subdir, srcPath, "png", node, width, foto);
      deploy(subdir, srcPath, "jpg", node, width, foto);
    });
  });
}

function deploy(subdir, srcPath, ext, { kode, url }, width, foto) {
  const fn = path.join(srcPath, kode + "." + ext);
  if (!fs.existsSync(fn)) return;
  const destFn = `${subdir}_${width}.${ext}`;
  if (foto[subdir] && foto[subdir].url.indexOf(destFn) >= 0) return;
  //  if (foto.banner && foto.banner.url.indexOf(destFn) >= 0) return;
  console.log(`scp "${fn}" "grunnkart@hydra:~/tilesdata/${url}/${destFn}"`);
}
