const { io, log } = require("lastejobb");
const fs = require("fs");
const path = require("path");
const config = require("./config");

const widths = [24, 48, 408, 950];

let script = "";

const c2p = {};
const p2c = {};
var data = io.readJson(config.datakilde.metabase);
Object.keys(data).forEach(kode => {
  const node = data[kode];
  if (node.overordnet.length > 0) {
    const parent = node.overordnet[0].kode;
    c2p[node.kode] = [parent];
    p2c[parent] = p2c[parent] || [];
    p2c[parent].push(node.kode);
    p2c[parent] = p2c[parent].sort();
  }
});

deployFrom("logo");
deployFrom("foto");
deployFrom("banner");
io.skrivBuildfil("publish.sh", script);

function deployFrom(subdir) {
  Object.keys(data).forEach(kode => {
    const node = data[kode];
    const foto = node.foto;
    widths.forEach(width => {
      const srcPath = path.join("build", subdir, width.toString());
      deploy(subdir, srcPath, node, width, foto);
    });
  });
}

function deploy(subdir, srcPath, { kode, url }, width, foto) {
  let image = findImage(srcPath, kode, p2c);
  if (!image) image = findImage(srcPath, kode, c2p);
  if (!image) return;
  const destFn = `${subdir}_${width}.${image.ext}`;
  const cmd = `scp "${
    image.path
  }" "grunnkart@hydra:~/tilesdata/${url}/${destFn}"\n`;
  log.info(cmd);
}

function findImage(srcPath, kode, reserve) {
  let r = {};
  const formats = ["png", "jpg"];
  for (var format of formats) {
    r.ext = format;
    r.path = path.join(srcPath, kode + "." + format);
    if (fs.existsSync(r.path)) return r;
  }
  const reservekoder = reserve[kode];
  if (!reservekoder) return null;
  for (kandidat of reservekoder) {
    r = findImage(srcPath, kandidat, reserve);
    if (r) return r;
  }
}
