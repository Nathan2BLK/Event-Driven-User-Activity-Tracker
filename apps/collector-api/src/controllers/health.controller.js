const healthController = {
  live: (req, res) => {
    // If process is running, it's alive.
    res.status(200).json({ status: "ok" });
  },

  ready: async (req, res, next) => {
    try {
      // For now: always ready.
      // Later: check DB connectivity here.
      res.status(200).json({ status: "ready" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { healthController };
