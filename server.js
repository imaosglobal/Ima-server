const express = require('express');
const app = express();

app.use(express.json());

// זיכרון מערכת
let memory = [];

// ניקוד לאייג'נטים
let scores = {
  ralph: 0,
  scribe: 0,
  backend: 0
};

// STATE - מצב מערכת
app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    memory,
    scores
  });
});

// EVENT - קבלת אירועים מה־cycle
app.post("/event", (req, res) => {
  const event = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  console.log("EVENT:", event);

  // שמירה בזיכרון
  memory.push(event);

  // למידה: עדכון score לפי agent
  const agent = event.agent;

  if (agent && scores.hasOwnProperty(agent)) {
    scores[agent] = scores[agent] + 1;
  }

  res.json({ ok: true });
});

// PORT
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
