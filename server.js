const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// =====================
// GLOBAL STATE (IMA)
// =====================
const ima = {
  memory: [],
  scores: {
    ralph: 0,
    scribe: 0,
    backend: 0
  }
};

// =====================
// CORE LOGIC
// =====================
function chooseAgent() {
  let best = "ralph";
  let max = -Infinity;

  for (const a in ima.scores) {
    if (ima.scores[a] > max) {
      max = ima.scores[a];
      best = a;
    }
  }

  return best;
}

// =====================
// STATE
// =====================
app.get("/state", (req, res) => {
  const snapshot = {
    status: "ok",
    memory: ima.memory.slice(-20),
    scores: {
      ralph: ima.scores.ralph,
      scribe: ima.scores.scribe,
      backend: ima.scores.backend
    },
    agent: chooseAgent()
  };

  const json = JSON.stringify(snapshot);

  res.setHeader("Content-Type", "application/json");
  res.end(json);
});
// =====================
// EVENT INGEST
// =====================
app.post("/event", (req, res) => {
  const event = req.body || {};

  const enriched = {
    ...event,
    timestamp: new Date().toISOString(),
    chosenAgent: chooseAgent()
  };

  ima.memory.push(enriched);

  if (event.agent && ima.scores[event.agent] !== undefined) {
    ima.scores[event.agent] += 1;
  }

  res.json({
    ok: true,
    chosen: chooseAgent()
  });
});

// =====================
// DECISION ENGINE
// =====================
app.get("/decide", (req, res) => {
  const tasks = [
    "heartbeat check",
    "optimize pipeline",
    "review architecture"
  ];

  const task = tasks[Math.floor(Math.random() * tasks.length)];
  const agent = chooseAgent();

  res.json({
    task,
    agent,
    reason: "score-based selection"
  });
});

// =====================
// START SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("IMA server running on port", PORT);
});
