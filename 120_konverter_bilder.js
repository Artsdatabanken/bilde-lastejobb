const config = require("./config");
const path = require("path");
const { spawnSync } = require("child_process");
const { io, log } = require("lastejobb");

function ikkeCrop2(kildesti) {
  if (kildesti.indexOf("/OR") >= 0) return true;
  if (kildesti.indexOf("/AO") < 0) return false;
  return kildesti.indexOf("banner") < 0;
}

function convertSync(kildesti, målsti, format, width, height = "") {
  log.info("converting", kildesti, " to ", width, "x", height, " in ", format);
  const ikkeCrop = ikkeCrop2(kildesti);
  const erBanner = width > 1.5 * height;
  const args = [
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
    //    '-verbose',
    "-debug",
    "user",
    "-path",
    målsti,
    kildesti
  ];
  console.log("mogrify " + args.join(" "));
  const r = spawnSync("mogrify", args);
  log.debug(r.output.toString());
  if (r.status > 0) log.error(r.stderr.toString());
}

function konverterAlle(kildesti, målsti, maxWidth, maxHeight) {
  const målstiwidth = `${målsti}/${maxWidth}`;
  io.mkdir(målstiwidth);
  console.log("Konverterer", kildesti);
  const files = io.findFiles(kildesti);
  console.log("Found " + files.length + " files..");
  for (var kildefil of files) {
    const kildePath = path.parse(kildefil);
    if (".png.svg.jpg".indexOf(kildePath.ext || "xxxx") < 0) continue;
    const format = ".svg.png".indexOf(kildePath.ext) >= 0 ? "png" : "jpg";
    //    const målfil = `${målstiwidth}/${kildePath.name}.${format}`;
    const målfil = kildefil
      .replace(kildesti, målstiwidth)
      .replace(kildePath.ext, "." + format);
    if (io.fileExists(målfil)) {
      log.info("skip", målfil);
      continue;
    }
    const målpath = path.parse(målfil);
    io.mkdir(målpath.dir);
    convertSync(kildefil, målpath.dir, format, maxWidth, maxHeight);
  }
}

const cfg = config.imagePath;

konverterAlle(cfg.source, cfg.processed, 950, 300);
return;
konverterAlle(cfg.source, cfg.processed, 408, 297);
konverterAlle(cfg.source, cfg.processed, 612, 446);
konverterAlle(cfg.source, cfg.processed, 816, 594);
konverterAlle(cfg.source, cfg.processed, 40, 40);

konverterAlle(cfg.custom_avatar, cfg.processed, 24, 24);
konverterAlle(cfg.custom_avatar, cfg.processed, 40, 40);
konverterAlle(cfg.custom_omslag, cfg.processed, 408, 297);
