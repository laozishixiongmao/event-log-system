const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

const events = [];
let nextId = 1;

app.post("/api/events", (req, res) => {
  const { type, message } = req.body || {};
  if (!type || !message) {
    return res.status(400).json({
      success: false,
      error: "type和message不能为空",
    });
  }

  const event = {
    id: nextId++,
    type: String(type),
    message: String(message),
    timestamp: new Date().toISOString(),
  };

  events.push(event);
  return res.status(201).json({ success: true, data: event });
});

app.get("/api/events", (req, res) => {
  const { type } = req.query;
  if (type) {
    const filtered = events.filter((event) => event.type === String(type));
    return res.json(filtered);
  }

  return res.json(events);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
