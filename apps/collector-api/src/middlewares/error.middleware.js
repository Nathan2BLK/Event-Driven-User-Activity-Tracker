function errorMiddleware(err, req, res, next) {
  // eslint not set up yet; keep it simple
  console.error("[collector-api] error:", err);

  return res.status(500).json({
    error: "Internal Server Error",
  });
}

module.exports = { errorMiddleware };