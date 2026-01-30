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
  // QUERY_PORT avoids collision with collector
  port: Number.parseInt(getEnv("QUERY_PORT", getEnv("PORT", "3001")), 10),
};

module.exports = { env };
