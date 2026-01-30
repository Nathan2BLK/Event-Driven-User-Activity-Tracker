const { eventsService } = require("../services/events.service");
const { validateEventPayload } = require("../services/eventValidation");

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
      const validation = validateEventPayload(req.body);
      if (!validation.ok) {
        return res.status(400).json({
          error: "Invalid payload",
          details: validation.reason ?? "Missing required fields",
          required: ["userId:string", "sessionId:string", "eventType:string"],
        });
      }
      const eventId = await eventsService.acceptEvent(req.body);
      // Now it’s synchronous DB write, so 201 Created is more truthful than 202.
      return res.status(201).json({ status: "stored", eventId });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = { eventsController };
