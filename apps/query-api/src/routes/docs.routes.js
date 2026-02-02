const express = require("express");
const swaggerUi = require("swagger-ui-express");
const yaml = require("yaml");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const specPath = path.join(process.cwd(), "openapi.yaml");
const specYaml = fs.readFileSync(specPath, "utf8");
const openapiSpec = yaml.parse(specYaml);

router.get("/openapi.yaml", (req, res) => {
  res.type("text/yaml").send(specYaml);
});

router.use("/docs", swaggerUi.serve, swaggerUi.setup(openapiSpec));

module.exports = router;
