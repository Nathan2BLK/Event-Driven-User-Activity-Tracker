function getEnv(name, defaultValue = undefined) {
  const value = process.env[name];
  if (value === undefined || value === "") {
    if (defaultValue !== undefined) return defaultValue;
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const env = {
  nodeEnv: getEnv("NODE_ENV", "development"),
  port: Number.parseInt(getEnv("COLLECTOR_PORT", getEnv("PORT", "3000")), 10),

  postgres: {
    host: getEnv("POSTGRES_HOST", "localhost"),
    port: Number.parseInt(getEnv("POSTGRES_PORT", "5432"), 10),
    database: getEnv("POSTGRES_DB", "event_tracker"),
    user: getEnv("POSTGRES_USER", "event_tracker"),
    password: getEnv("POSTGRES_PASSWORD", "event_tracker_pwd"),
  },
};

module.exports = { env };