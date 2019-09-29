const path = require("path");
const { io, log } = require("lastejobb");

const cfg = {
  source: "data",
  processed: "build"
};

function convertSync(kildesti, målsti, format, width, height = "", bildetype) {
  log.info("converting", kildesti, " to ", width, "x", height, " in ", format);
  const erLogo = bildetype === "logo";
  const ikkeCrop = erLogo;
  const erBanner = width > 1.5 * height;
  const args = [
    "-auto-orient",
    "-resize",
    width + "x" + height + (ikkeCrop ? "" : "^"),
    "-gravity",
    erBanner ? "west" : "center",
    erBanner ? "-extent" : "",
    erBanner ? width + "x" + height : "",
    "+repage",
    "-crop",
    width + "x" + height + "+0+0",
    "-background",
    "transparent",
    "-format",
    format,
    "-density",
    "600",
    "-channel",
    "A",
    "-evaluate",
    "multiply",
    erLogo ? "0.6" : "1.0",
    //    '-verbose',
    "-debug",
    "user",
    "-path",
    målsti,
    kildesti
  ];
  console.log("mogrify " + args.join(" "));
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
    //    const målfil = `${målstiwidth}/${kildePath.name}.${format}`;
    const målfil = kildefil
      .replace(kildesti, målstiwidth)
      .replace(kildePath.ext, "." + format);
    if (io.fileExists(målfil)) {
      //      log.info("skip", målfil);
      continue;
    }
    const målpath = path.parse(målfil);
    if (kildefil === "data/logo/VV.svg") debugger;
    convertSync(kildefil, målpath.dir, format, maxWidth, maxHeight, bildetype);
  }
}

konverterAlle("logo", 24, 24);
konverterAlle("logo", 48, 48);
//konverterAlle("logo", 408, 297);
//konverterAlle("logo", 950, 300);
konverterAlle("banner", 950, 300);
konverterAlle("foto", 408, 297);
//konverterAlle(cfg.source, cfg.processed, 612, 446);
//konverterAlle(cfg.source, cfg.processed, 816, 594);
