const express = require('express');
const app = express();

app.use(express.json());

// =====================
// SYSTEM STATE (single object)
// =====================

let ima = {
  memory: [],
  scores: {
    ralph: 0,
    scribe: 0,
    backend: 0
  }
};

// =====================
// HELPERS
// =====================

function chooseAgent() {
  let best = "ralph";
  let bestScore = -Infinity;

  for (const agent in ima.scores) {
    if (ima.scores[agent] > bestScore) {
      bestScore = ima.scores[agent];
      best = agent;
    }
  }

  return best;
}

// =====================
// ROUTES
// =====================

// מצב מערכת
app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    agent: chooseAgent(),
    ima
  });
});

// קבלת אירוע
app.post("/event", (req, res) => {
  const event = req.body || {};

  const enriched = {
    ...event,
    timestamp: new Date().toISOString(),
    chosenAgent: chooseAgent()
  };

  ima.memory.push(enriched);

  const agent = event.agent;

  if (agent && ima.scores[agent] !== undefined) {
    ima.scores[agent] += 1;
  }

  res.json({
    ok: true,
    chosen: chooseAgent()
  });
});

// בדיקת agent
app.get("/agent", (req, res) => {
  res.json({
    chosen: chooseAgent(),
    scores: ima.scores
  });
});

// =====================
// START
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
