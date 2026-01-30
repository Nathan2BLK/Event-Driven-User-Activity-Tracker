const { eventsService } = require("../services/events.service");

const eventsController = {
  listEvents: async (req, res, next) => {
    try {
      const filters = {
        userId: req.query.userId,
        type: req.query.type,
        from: req.query.from,
        to: req.query.to,
        limit: req.query.limit,
      };

      const result = await eventsService.listEvents(filters);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { eventsController };
