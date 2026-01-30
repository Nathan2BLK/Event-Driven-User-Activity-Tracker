const { query } = require("../db/postgres");

const statsService = {
  topEventTypes: async ({ from = null, to = null, limit = 10 } = {}) => {
    const params = [];
    const where = [];

    if (from) {
      params.push(from);
      where.push(`timestamp >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      where.push(`timestamp <= $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    params.push(limit);

    const sql = `
      SELECT event_type AS "eventType", COUNT(*)::int AS count
      FROM events
      ${whereSql}
      GROUP BY event_type
      ORDER BY count DESC
      LIMIT $${params.length}
    `;

    const res = await query(sql, params);
    return { data: res.rows };
  },

  eventsPerMinute: async ({ from = null, to = null } = {}) => {
    const params = [];
    const where = [];

    if (from) {
      params.push(from);
      where.push(`timestamp >= $${params.length}`);
    }
    if (to) {
      params.push(to);
      where.push(`timestamp <= $${params.length}`);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    // date_trunc buckets by minute
    const sql = `
      SELECT date_trunc('minute', timestamp) AS minute,
             COUNT(*)::int AS count
      FROM events
      ${whereSql}
      GROUP BY minute
      ORDER BY minute ASC
    `;

    const res = await query(sql, params);
    return {
      data: res.rows.map((r) => ({
        minute: r.minute,
        count: r.count,
      })),
    };
  },
};

module.exports = { statsService };