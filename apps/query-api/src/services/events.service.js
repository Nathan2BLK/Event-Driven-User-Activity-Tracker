const { query } = require("../db/postgres");

function buildWhere(filters, params) {
  const where = [];

  if (filters.userId) {
    params.push(filters.userId);
    where.push(`user_id = $${params.length}`);
  }

  if (filters.eventType) {
    params.push(filters.eventType);
    where.push(`event_type = $${params.length}`);
  }

  if (filters.from) {
    params.push(filters.from);
    where.push(`timestamp >= $${params.length}`);
  }

  if (filters.to) {
    params.push(filters.to);
    where.push(`timestamp <= $${params.length}`);
  }

  return where.length ? `WHERE ${where.join(" AND ")}` : "";
}

const eventsService = {
  listEvents: async (filters) => {
    const params = [];
    const whereSql = buildWhere(filters, params);

    // Count (for pagination UI)
    const countSql = `SELECT COUNT(*)::int AS total FROM events ${whereSql}`;
    const countRes = await query(countSql, params);
    const total = countRes.rows[0]?.total ?? 0;

    // Data query
    const dataParams = [...params];
    dataParams.push(filters.limit);
    dataParams.push(filters.offset);

    const dataSql = `
      SELECT id, timestamp, user_id AS "userId", session_id AS "sessionId",
             event_type AS "eventType", source, metadata
      FROM events
      ${whereSql}
      ORDER BY timestamp DESC
      LIMIT $${dataParams.length - 1} OFFSET $${dataParams.length}
    `;

    const dataRes = await query(dataSql, dataParams);

    return {
      data: dataRes.rows,
      total,
      limit: filters.limit,
      offset: filters.offset,
    };
  },
};

module.exports = { eventsService };
