const { csv, io } = require("lastejobb");

importer(
  "landskap_bilder_som_gjenbrukes.csv",
  "landskap_bilder_som_gjenbrukes"
);

function importer(csvFil, utFil) {
  const json = csv.les("data/" + csvFil, { from_line: 1 });
  const writePath = "data/" + utFil + ".csv.json";
  io.writeJson(writePath, json);
}
