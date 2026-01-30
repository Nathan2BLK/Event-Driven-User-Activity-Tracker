const healthController = {
  live: (req, res) => {
    res.status(200).json({ status: "ok" });
  },

  ready: async (req, res, next) => {
    try {
      // Later: check DB connectivity
      res.status(200).json({ status: "ready" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { healthController };
