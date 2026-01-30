const { getPool } = require("../db/postgres");

const healthController = {
  live: (req, res) => res.status(200).json({ status: "ok" }),

  ready: async (req, res, next) => {
    try {
      await getPool().query("SELECT 1");
      res.status(200).json({ status: "ready" });
    } catch (err) {
      // readiness should fail if DB is down
      res.status(503).json({ status: "not_ready", error: "db_unreachable" });
    }
  },
};

module.exports = { healthController };