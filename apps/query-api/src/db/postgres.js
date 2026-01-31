const { Pool } = require("pg");
const { env } = require("../config/env");
const { dbQueryDuration } = require("../metrics/metrics");

let pool;

function getPool() {
  if (!pool) {
    pool = new Pool({
      host: env.postgres.host,
      port: env.postgres.port,
      database: env.postgres.database,
      user: env.postgres.user,
      password: env.postgres.password,
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 2_000,
    });
  }
  return pool;
}

async function queryWithName(queryName, text, params) {
  const end = dbQueryDuration.startTimer({ service: "query-api", query_name: queryName });
  try {
    return await getPool().query(text, params);
  } finally {
    end();
  }
}

module.exports = { queryWithName, getPool };