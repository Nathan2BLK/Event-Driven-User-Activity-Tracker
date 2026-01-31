const { metricsHandler } = require("../metrics/metrics");

const metricsController = {
  getMetrics: metricsHandler,
};

module.exports = { metricsController };

