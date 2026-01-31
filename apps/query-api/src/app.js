const express = require("express");
const { eventsRouter } = require("./routes/events.routes");
const { statsRouter } = require("./routes/stats.routes");
const { healthRouter } = require("./routes/health.routes");
const { metricsRouter } = require("./routes/metrics.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");
const { metricsMiddleware } = require("./metrics/metrics");

function createApp() {
  const app = express();

  app.use(express.json({ limit: "1mb" }));
  app.use(metricsMiddleware("query-api"));

  app.use("/events", eventsRouter);
  app.use("/stats", statsRouter);
  app.use("/health", healthRouter);
  app.use("/metrics", metricsRouter);

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
