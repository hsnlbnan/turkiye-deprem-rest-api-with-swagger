var express = require("express");
var app = express();
var http = require("http");
const cors = require("cors");

var swaggerUi = require("swagger-ui-express");
swaggerDocument = require("./swagger.json");
const indexController = require("./controller/indexController");
const PORT = 3333;

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
