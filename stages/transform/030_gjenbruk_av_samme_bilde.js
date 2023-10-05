const { csv, io } = require("@artsdatabanken/lastejobb");

importer(
  "landskap_bilder_som_gjenbrukes.csv",
  "landskap_bilder_som_gjenbrukes"
);

function importer(csvFil, utFil) {
  const json = csv.les("temp/" + csvFil, { from_line: 1 });
  const writePath = "temp/" + utFil + ".csv.json";
  io.writeJson(writePath, json);
}
