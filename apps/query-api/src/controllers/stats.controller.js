const { statsService } = require("../services/stats.service");

const statsController = {
  topEventTypes: async (req, res, next) => {
    try {
      res.status(200).json(await statsService.topEventTypes());
    } catch (err) {
      next(err);
    }
  },

  eventsPerMinute: async (req, res, next) => {
    try {
      res.status(200).json(await statsService.eventsPerMinute());
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { statsController };
