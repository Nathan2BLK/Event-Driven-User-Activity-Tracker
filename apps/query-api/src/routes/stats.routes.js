const express = require("express");
const { statsController } = require("../controllers/stats.controller");

const statsRouter = express.Router();

statsRouter.get("/top-event-types", statsController.topEventTypes);
statsRouter.get("/events-per-minute", statsController.eventsPerMinute);

module.exports = { statsRouter };
