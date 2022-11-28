const port = 5555;
const express = require("express");
const app = express();

app.get("/recup", (req, res) => {
  const send = [];
  const fs = require("fs");
  const unzip = require("unzip-stream");
  const download = require("download");
  const csv = require("csv-parser");
  var i = 0;
  var countTrue = 0;
  download(
    "https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip",
    "data"
  ).then(() => {
    fs.createReadStream("data/StockEtablissementLiensSuccession_utf8.zip")
      .pipe(unzip.Parse())
      .on("entry", function (entry) {
        const fileName = entry.path;
        if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
          entry
            .pipe(csv())
            .on("data", (data) => send.push(data))
            .on("end", () => {
              send.forEach((element) => {
                if (element.transfertSiege == "true") {
                  countTrue++;
                }
                i++;
              });
              let multi = (countTrue / i) * 100;
              res.send(
                `Le nombre d'entreprises qui ont transféré leur siège social depuis le 1er Novembre 2022 est d'environ ${multi.toFixed(
                  2
                )}%`
              );
            });
        } else {
          entry.autodrain();
        }
      });
  });
});
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
