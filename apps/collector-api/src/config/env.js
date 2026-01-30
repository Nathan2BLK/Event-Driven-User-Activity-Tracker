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
  port: Number.parseInt(getEnv("PORT", "3000"), 10),
  // DB vars will be added (postgres integration)
};

module.exports = { env };
