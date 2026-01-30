const express = require("express");
const { metricsController } = require("../controllers/metrics.controller");

const metricsRouter = express.Router();

metricsRouter.get("/", metricsController.getMetrics);

module.exports = { metricsRouter };
