const express = require("express");
const { eventsRouter } = require("./routes/events.routes");
const { healthRouter } = require("./routes/health.routes");
const { metricsRouter } = require("./routes/metrics.routes");
const { errorMiddleware } = require("./middlewares/error.middleware");

function createApp() {
  const app = express();

  // Parse JSON
  app.use(express.json({ limit: "1mb" }));

  // Routes
  app.use("/events", eventsRouter);
  app.use("/health", healthRouter);
  app.use("/metrics", metricsRouter);

  // Fallback 404
  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  // Error handler (must be last)
  app.use(errorMiddleware);

  return app;
}

module.exports = { createApp };
