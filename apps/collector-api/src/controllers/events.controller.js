const { eventsService } = require("../services/events.service");

function isValidEventPayload(body) {
  // Minimal “basic schema check” for now (no external lib)
  return (
    body &&
    typeof body.userId === "string" &&
    typeof body.sessionId === "string" &&
    typeof body.eventType === "string"
  );
}

const eventsController = {
  createEvent: async (req, res, next) => {
    try {
      if (!isValidEventPayload(req.body)) {
        return res.status(400).json({
          error: "Invalid payload",
          required: ["userId:string", "sessionId:string", "eventType:string"],
        });
      }

      await eventsService.acceptEvent(req.body);

      // 202 Accepted is fine for an ingestion service
      return res.status(202).json({ status: "accepted" });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { eventsController };
