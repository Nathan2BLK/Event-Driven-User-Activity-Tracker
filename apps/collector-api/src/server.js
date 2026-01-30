const { createApp } = require("./app");
const { env } = require("./config/env");

const app = createApp();

app.listen(env.port, () => {
  // Keep logs clean and consistent
  console.log(`[collector-api] listening on port ${env.port} (${env.nodeEnv})`);
});
