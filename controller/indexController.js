const cheerio = require("cheerio");
const request = require("request");

exports.index = function (req, res) {
  const city = req.query.city;
  const depth = req.query.depth;

  var items = [];
  request(
    "http://www.koeri.boun.edu.tr/scripts/lst0.asp",
    (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        const response = $("pre").text();
        var result = response.split("\n");
        result = result.splice(6, result.length + 1);
        result = result.splice(0, result.length - 2);
        result.forEach((element) => {
          var dataString = element.split(" ");
          var dataInfo = [];
          for (var i = 0; i < dataString.length; i++) {
            if (dataString[i].length > 0) {
              dataInfo.push(dataString[i]);
            }
          }
          var date = dataInfo[0];
          var time = dataInfo[1];
          var latitude = dataInfo[2];
          var longitude = dataInfo[3];
          var depth = dataInfo[4];
          var intensity = dataInfo[6];
          var region = dataInfo[8];
          if (region !== null) {
            region = region
              .replace("-", " ")
              .toLocaleLowerCase()
              .replace(/\b[a-z]/g, function (letter) {
                return letter.toUpperCase();
              });
          }
          var city = dataInfo[9];
          if (city != null) {
            if (dataInfo[9].includes("(")) {
              city = dataInfo[9]
                .replace("(", "")
                .replace(")", "")
                .toLowerCase()
                .replace(/\b[a-z]/g, function (letter) {
                  return letter.toUpperCase();
                });
              if (city.includes("I")) {
                city = city.replace("I", "İ");
              }
              if (city.includes("g")) {
                city = city.replace("g", "ğ");
              }
            } else {
              city = "";
            }
          } else {
            city = "";
          }

          const pushData = {
            date,
            time,
            latitude,
            longitude,
            depth,
            intensity,
            region,
            city,
          };
          items.push(pushData);
        });

        const filteredCities = items.filter((item) => {
          if (city && depth && intensity) {
            return (
              item.city.includes(city) &&
              item.depth.includes(city) &&
              item.intensity.includes(intensity)
            );
          } else if (city) {
            return item.city.includes(city);
          } else if (depth) {
            return item.depth.includes(depth);
          } else {
            return item;
          }
        });

        res.send(filteredCities);
      }
    }
  );
};
