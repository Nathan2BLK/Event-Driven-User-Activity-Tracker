const { eventsService } = require("../services/events.service");

function parseLimit(value) {
  if (value === undefined) return 100;
  const n = Number.parseInt(value, 10);
  if (Number.isNaN(n) || n <= 0) return null;
  return Math.min(n, 500); // hard cap to prevent abuse
}

const eventsController = {
  listEvents: async (req, res, next) => {
    try {
      const limit = parseLimit(req.query.limit);
      if (limit === null) {
        return res.status(400).json({ error: "Invalid limit" });
      }

      // from/to are ISO strings or undefined
      const from = req.query.from ? new Date(req.query.from) : null;
      const to = req.query.to ? new Date(req.query.to) : null;

      if (from && Number.isNaN(from.getTime())) {
        return res.status(400).json({ error: "Invalid from date" });
      }
      if (to && Number.isNaN(to.getTime())) {
        return res.status(400).json({ error: "Invalid to date" });
      }

      const filters = {
        userId: req.query.userId || null,
        eventType: req.query.type || null,
        from,
        to,
        limit,
        offset: req.query.offset ? Number.parseInt(req.query.offset, 10) : 0,
      };

      if (Number.isNaN(filters.offset) || filters.offset < 0) {
        return res.status(400).json({ error: "Invalid offset" });
      }

      const result = await eventsService.listEvents(filters);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { eventsController };
