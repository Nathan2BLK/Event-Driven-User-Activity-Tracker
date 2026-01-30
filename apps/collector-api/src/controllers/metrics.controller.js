const metricsController = {
  getMetrics: (req, res) => {
    // Placeholder: Prometheus exposition format will come later
    res
      .status(200)
      .type("text/plain")
      .send("# metrics not implemented yet\n");
  },
};

module.exports = { metricsController };
