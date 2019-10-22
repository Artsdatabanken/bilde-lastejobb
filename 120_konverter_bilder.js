const path = require("path");
const { io, log } = require("lastejobb");

const cfg = {
  source: "data",
  processed: "build"
};

function convertSync(kildesti, målsti, format, width, height = "", bildetype) {
  log.info("converting", kildesti, " to ", width, "x", height, " in ", format);
  const erLogo = bildetype === "logo" || bildetype === "phylopic";
  const ikkeCrop = erLogo;
  const faded = erLogo && width < 100;
  const erBanner = width > 1.5 * height;
  var args = [
    "-auto-orient",
    "-gravity",
    erBanner ? "west" : "center",
    erBanner ? "-extent" : "",
    erBanner ? width + "x" + height : "",
    "+repage",
    //    "-crop", width + "x" + height + "+0+0",
    "-background",
    "transparent",
    "-transparent",
    "white",
    "-format",
    format,
    "-density",
    "600",
    "-channel",
    "A",
    "-evaluate",
    "multiply",
    faded ? "0.65" : "1.0",
    //    '-verbose',
    //"-debug", "user",
    "-path",
    målsti
  ];
  if (width === 40) {
    args.push("-extent");
    args.push("40x40+0+0");
  }
  if (width === 40) {
    width = 30;
    height = 30;
  }

  // mogrify -auto-orient -gravity center +repage -background transparent -transparent white -format png -density 600 -auto-level -path build/phylopic/40 -resize 30x30 -extent 30x30 -border 5x5 -bordercolor transparent -verbose data/phylopic/AR-123932.png && file build/phylopic/40/AR-123932.png && eog build/phylopic/40/AR-123932.png

  args.push("-resize");
  args.push(width + "x" + height + (ikkeCrop ? "" : "^"));
  args.push(kildesti);

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
