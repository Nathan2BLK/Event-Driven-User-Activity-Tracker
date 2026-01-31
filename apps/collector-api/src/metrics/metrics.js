const client = require("prom-client");

if (process.env.NODE_ENV === "test") {
  client.register.clear();
}
client.collectDefaultMetrics();

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["service", "method", "route", "status"],
});

const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["service", "method", "route", "status"],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
});

const eventsIngestedTotal = new client.Counter({
  name: "events_ingested_total",
  help: "Total number of events successfully ingested",
  labelNames: ["event_type"],
});

function metricsMiddleware(serviceName) {
  return (req, res, next) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
      // Prefer Express route pattern (req.route.path) when available
      const route =
        (req.route && req.route.path && `${req.baseUrl}${req.route.path}`) ||
        req.path ||
        "unknown";

      const status = String(res.statusCode);
      const durationSec = Number(process.hrtime.bigint() - start) / 1e9;

      httpRequestsTotal.inc({
        service: serviceName,
        method: req.method,
        route,
        status,
      });

      httpRequestDuration.observe(
        { service: serviceName, method: req.method, route, status },
        durationSec
      );
    });

    next();
  };
}

async function metricsHandler(req, res) {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
}

module.exports = {
  metricsMiddleware,
  metricsHandler,
  eventsIngestedTotal,
};
