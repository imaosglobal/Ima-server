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

  const agent = event.agent;
  const task = event.task;

  // שמירה בזיכרון
  const record = {
    ...event,
    timestamp: new Date().toISOString()
  };

  ima.memory.push(record);

  // =====================
  // LEARNING (REWARD)
  // =====================

  if (agent && ima.scores[agent] !== undefined) {
    let reward = 0;

    // חוקים פשוטים ללמידה
    if (event.status === "success") reward += 1;
    if (event.status === "fail") reward -= 1;

    // משקל לפי סוג task
    if (task === "heartbeat check") reward += 0.2;
    if (task === "optimize pipeline") reward += 0.5;
    if (task === "review architecture") reward += 0.7;

    ima.scores[agent] += reward;
  }

  res.json({
    ok: true,
    memorySize: ima.memory.length,
    scores: ima.scores
  });
});
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
app.get("/decide", (req, res) => {
  const taskPool = [
    "heartbeat check",
    "optimize pipeline",
    "review architecture"
  ];

  // הסתכלות על הזיכרון האחרון
  const lastEvents = ima.memory.slice(-10);

  const taskCount = {};
  const agentScoreBoost = {
    ralph: 0,
    scribe: 0,
    backend: 0
  };

  // ניתוח היסטוריה
  for (const e of lastEvents) {
    if (e.task) {
      taskCount[e.task] = (taskCount[e.task] || 0) + 1;
    }

    if (e.agent && agentScoreBoost[e.agent] !== undefined) {
      agentScoreBoost[e.agent] += 0.1;
    }
  }

  // בחירת task פחות נפוץ (anti-repeat)
  let task = taskPool[0];
  let minCount = Infinity;

  for (const t of taskPool) {
    const c = taskCount[t] || 0;
    if (c < minCount) {
      minCount = c;
      task = t;
    }
  }

  // בחירת agent עם bonus מההיסטוריה
  let agent = "ralph";
  let best = -Infinity;

  for (const a in ima.scores) {
    const score = ima.scores[a] + (agentScoreBoost[a] || 0);
    if (score > best) {
      best = score;
      agent = a;
    }
  }

  res.json({
    task,
    agent,
    reasoning: {
      taskCount,
      agentScoreBoost
    }
  });
});
  const taskPool = [
    "heartbeat check",
    "optimize pipeline",
    "review architecture"
  ];

  const task = taskPool[Math.floor(Math.random() * taskPool.length)];
  const agent = chooseAgent();

  res.json({
    task,
    agent,
    reason: "selected by current scores"
  });
});
