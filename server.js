const express = require('express');
const app = express();

app.use(express.json());

// מצב מבודד לחלוטין (אין undefined בכלל)
function getFreshScores() {
  return {
    ralph: 0,
    scribe: 0,
    backend: 0
  };
}

let memory = [];
let scores = getFreshScores();

// STATE
app.get("/state", (req, res) => {
  try {
    res.json({
      status: "ok",
      memory: memory || [],
      scores: scores || getFreshScores()
    });
  } catch (e) {
    res.status(500).json({
      status: "error",
      message: "state crash recovered"
    });
  }
});

// EVENT
app.post("/event", (req, res) => {
  try {
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
  } catch (e) {
    console.log("EVENT ERROR:", e);
    res.status(500).json({ ok: false });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
