var port = 5555;
var express = require("express");
var app = express();
app.get("/recup", function (req, res) {
  var send = [];
  var fs = require("fs");
  var unzip = require("unzip-stream");
  var download = require("download");
  var csv = require("csv-parser");
  var i = 0;
  var countTrue = 0;
  download(
    "https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip",
    "data"
  ).then(function () {
    fs.createReadStream("data/StockEtablissementLiensSuccession_utf8.zip")
      .pipe(unzip.Parse())
      .on("entry", function (entry) {
        var fileName = entry.path;
        if (fileName === "StockEtablissementLiensSuccession_utf8.csv") {
          entry
            .pipe(csv())
            .on("data", function (data) {
              if (data.transfertSiege == "true") {
                countTrue++;
              }
              i++;
            })
            .on("end", function () {
              send.forEach(function (element) {});
              var multi = (countTrue / i) * 100;
              res.send(
                "Le nombre d'entreprises qui ont transf\u00E9r\u00E9 leur si\u00E8ge social depuis le 1er Novembre 2022 est d'environ ".concat(
                  multi.toFixed(2),
                  "%"
                )
              );
            });
        } else {
          entry.autodrain();
        }
      });
  });
});
app.listen(port, function () {
  return console.log("Example app listening on port ".concat(port, "!"));
});
