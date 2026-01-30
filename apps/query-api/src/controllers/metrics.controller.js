const metricsController = {
  getMetrics: (req, res) => {
    res
      .status(200)
      .type("text/plain")
      .send("# metrics not implemented yet\n");
  },
};

module.exports = { metricsController };