const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const ima = {
  memory: [],
  scores: { ralph: 0, scribe: 0, backend: 0 }
};

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

app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    memory: ima.memory.slice(-20),
    scores: ima.scores,
    agent: chooseAgent()
  });
});

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

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("IMA engine running on port", PORT);
});
