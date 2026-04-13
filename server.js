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
  res.json({
    status: "ok",
    memory,
    scores
  });
});

app.post("/event", (req, res) => {
  const event = {
    ...req.body,
    timestamp: new Date().toISOString()
  };

  console.log("EVENT:", event);

  memory.push(event);

  // למידה פשוטה: מוסיפים נקודה לאייג'נט
  if (event.agent && scores[event.agent] !== undefined) {
    scores[event.agent] += 1;
  }

  res.json({ ok: true });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
