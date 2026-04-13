const express = require('express');
const app = express();

app.use(express.json());

// =====================
// STATE
// =====================

let memory = [];

let scores = {
  ralph: 0,
  scribe: 0,
  backend: 0
};

// =====================
// CORE LOGIC
// =====================

// בוחר agent הכי חזק לפי score
function chooseAgent() {
  let bestAgent = "ralph";
  let bestScore = -Infinity;

  for (const agent in scores) {
    if (scores[agent] > bestScore) {
      bestScore = scores[agent];
      bestAgent = agent;
    }
  }

  return bestAgent;
}

// =====================
// ROUTES
// =====================

// מצב מערכת
app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    memory,
    scores
  });
});

// בחירת agent נוכחי
app.get("/agent", (req, res) => {
  res.json({
    chosen: chooseAgent(),
    scores
  });
});

// קבלת events מה-cycle / termux
app.post("/event", (req, res) => {
  const event = req.body || {};

  console.log("EVENT:", event);

  const enrichedEvent = {
    ...event,
    timestamp: new Date().toISOString()
  };

  memory.push(enrichedEvent);

  // למידה: חיזוק agent
  const agent = event.agent;

  if (agent && scores[agent] !== undefined) {
    scores[agent] += 1;
  }

  res.json({
    ok: true,
    chosenAgent: chooseAgent()
  });
});

// =====================
// START
// =====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
