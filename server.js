const express = require('express');
const app = express();

app.use(express.json());

let memory = [];
let scores = {
  ralph: 0,
  scribe: 0,
  backend: 0
};

app.get("/state", (req, res) => {
  res.setHeader('Content-Type', 'application/json');

  res.json({
    status: "ok",
    memory: Array.isArray(memory) ? memory : [],
    scores: scores || { ralph: 0, scribe: 0, backend: 0 }
  });
});

app.post("/event", (req, res) => {
  const event = req.body || {};

  console.log("EVENT:", event);

  memory.push({
    ...event,
    timestamp: new Date().toISOString()
  });

  const agent = event.agent;

  if (agent && scores[agent] !== undefined) {
    scores[agent] += 1;
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
