const { Pool } = require("pg");
const { env } = require("../config/env");

let pool;

/**
 * Lazy-init pool (helps for tests later).
 */
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

async function query(text, params) {
  const p = getPool();
  return p.query(text, params);
}

module.exports = { query, getPool };
