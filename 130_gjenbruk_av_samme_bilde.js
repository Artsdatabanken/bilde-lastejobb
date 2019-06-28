// Finner bilder fra undertyper som kan brukes hvis det mangler bilder
// Dette gjøres nå også i 140, men da kopieres bildet
// Burde man symlinke?

const { io, log } = require("lastejobb");

let script = [];
// Forventer følgende katalogstruktur på tile serveren:
// /type/subtype/.../format.projeksjon.filtype
// Dvs. at rotkatalog betraktes som klasse av data, eks. gradient eller trinn
const map = io.lesDatafil("landskap_bilder_som_gjenbrukes.csv.json").items;
finnBilderSomKanGjenbrukesForLandskap("build/foto/408");
finnBilderSomKanGjenbrukesForLandskap("build/banner/950");
io.skrivDatafil(__filename, script);

function finnBilderSomKanGjenbrukesForLandskap(basename) {
  map.forEach(e => {
    const mål = "NN-LA-" + e.På;
    const kilde = e["Bruk bilde fra"].replace("LA-", "NN-LA-TI-");
    dupliser(basename, kilde, mål);
  });
}

function dupliser(basename, kildeUrl, målUrl) {
  script.push(`cp -n ${basename}/${kildeUrl}.jpg ${basename}/${målUrl}.jpg`);
  console.log(`cp -n ${basename}/${kildeUrl}.jpg ${basename}/${målUrl}.jpg`);
}
