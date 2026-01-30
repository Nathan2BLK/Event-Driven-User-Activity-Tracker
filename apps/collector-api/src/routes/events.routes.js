const express = require("express");
const { eventsController } = require("../controllers/events.controller");

const eventsRouter = express.Router();

eventsRouter.post("/", eventsController.createEvent);

module.exports = { eventsRouter };
