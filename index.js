var express = require("express");
var app = express();
var http = require("http");
const cors = require("cors");
require("dotenv").config();

var swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
const indexController = require("./controller/indexController");
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    exposedHeaders: "*",
  })
);
app.get("/api", indexController.index);

app.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

http.createServer(app).listen(PORT, function () {
  console.log("Server is running on port http://localhost:" + PORT);
});
