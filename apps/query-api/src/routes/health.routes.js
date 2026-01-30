const express = require("express");
const { healthController } = require("../controllers/health.controller");

const healthRouter = express.Router();

healthRouter.get("/live", healthController.live);
healthRouter.get("/ready", healthController.ready);

module.exports = { healthRouter };
