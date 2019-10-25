const path = require("path");
const { io, log } = require("lastejobb");
const Mogrify = require("./lib/mogrify");

const cfg = {
  source: "data",
  processed: "build"
};

function convertSync(kildesti, målsti, format, width, height = "", bildetype) {
  mogrify = new Mogrify();
  log.info("converting", kildesti, " to ", width, "x", height, " in ", format);
  const erLogo = bildetype === "logo" || bildetype === "phylopic";
  const ikkeCrop = erLogo;
  const erBanner = width > 1.5 * height;
  mogrify.gravity(erBanner ? "west" : "center");
  mogrify.repage();
  mogrify.background("transparent");
  mogrify.transparent("white");
  mogrify.format(format);
  mogrify.density(600);
  //  const faded = erLogo && width < 100;
  //"-channel","A","-evaluate","multiply",faded ? "0.65" : "1.0",
  mogrify.autolevel();
  mogrify.destPath(målsti);

  if (width === 40) {
    width = 30;
    height = 30;
  }
  mogrify.resize(width + "x" + height + (ikkeCrop ? "" : "^"));
  if (erBanner) mogrify.extent(width + "x" + height);
  else mogrify.extent(width + "x" + height);
  mogrify.border("5x5");
  mogrify.convert(kildesti);

  //  const r = spawnSync("mogrify", args);
  //  log.debug(r.output.toString());
  // if (r.status > 0) log.error(r.stderr.toString());
}

function konverterAlle(bildetype, maxWidth, maxHeight) {
  const kildesti = path.join(cfg.source, bildetype);
  const målsti = path.join(cfg.processed, bildetype);

  const målstiwidth = `${målsti}/${maxWidth}`;
  io.mkdir(målstiwidth);
  console.log("Konverterer", kildesti);
  const files = io.findFiles(kildesti);
  console.log("Found " + files.length + " files..");
  for (var kildefil of files) {
    const kildePath = path.parse(kildefil);
    if (".png.svg.jpg".indexOf(kildePath.ext || "xxxx") < 0) continue;
    let format = ".svg.png".indexOf(kildePath.ext) >= 0 ? "png" : "jpg";
    if (bildetype === "logo") format = "png";
    const målfil = kildefil
      .replace(kildesti, målstiwidth)
      .replace(kildePath.ext, "." + format);
    if (io.fileExists(målfil)) continue;

    const målpath = path.parse(målfil);
    convertSync(kildefil, målpath.dir, format, maxWidth, maxHeight, bildetype);
  }
}

konverterAlle("phylopic", 40, 40);
konverterAlle("phylopic", 48, 48);
konverterAlle("phylopic", 560, 560);
konverterAlle("logo", 24, 24);
konverterAlle("logo", 40, 40);
konverterAlle("logo", 48, 48);
konverterAlle("logo", 408, 297);
//konverterAlle("logo", 950, 300);
konverterAlle("banner", 950, 300);
konverterAlle("foto", 408, 297);
//konverterAlle(cfg.source, cfg.processed, 612, 446);
//konverterAlle(cfg.source, cfg.processed, 816, 594);
