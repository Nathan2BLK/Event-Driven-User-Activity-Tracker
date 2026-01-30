const { statsService } = require("../services/stats.service");

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function parseLimit(value, defaultValue) {
  if (!value) return defaultValue;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return Math.min(n, 50);
}

const statsController = {
  topEventTypes: async (req, res, next) => {
    try {
      const from = parseDate(req.query.from);
      const to = parseDate(req.query.to);
      if (req.query.from && !from) return res.status(400).json({ error: "Invalid from date" });
      if (req.query.to && !to) return res.status(400).json({ error: "Invalid to date" });

      const limit = parseLimit(req.query.limit, 10);
      if (limit === null) return res.status(400).json({ error: "Invalid limit" });

      res.status(200).json(await statsService.topEventTypes({ from, to, limit }));
    } catch (err) {
      next(err);
    }
  },

  eventsPerMinute: async (req, res, next) => {
    try {
      const from = parseDate(req.query.from);
      const to = parseDate(req.query.to);
      if (req.query.from && !from) return res.status(400).json({ error: "Invalid from date" });
      if (req.query.to && !to) return res.status(400).json({ error: "Invalid to date" });

      res.status(200).json(await statsService.eventsPerMinute({ from, to }));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { statsController };
