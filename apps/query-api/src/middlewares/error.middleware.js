// middlewares/error.middleware.js
function errorMiddleware(err, req, res, next) {
  console.error("[query-api] error:", err);
  res.status(500).json({ error: "Internal Server Error" });
}

module.exports = { errorMiddleware };
