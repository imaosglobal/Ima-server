const express = require('express');
const app = express();

app.use(express.json());

// memory in RAM (נשמר כל עוד השרת חי)
let memory = [];

/**
 * STATE - מחזיר מצב מערכת
 */
app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    memory
  });
});

/**
 * EVENT - קבלת אירועים מ-Termux / cycle
 */
app.post("/event", (req, res) => {
  console.log("EVENT:", req.body);

  memory.push({
    timestamp: new Date().toISOString(),
    data: req.body
  });

  res.json({ ok: true });
});

/**
 * WEBHOOK - GitHub / external triggers (אופציונלי)
 */
app.post("/webhook", (req, res) => {
  console.log("WEBHOOK:", req.body);
  res.sendStatus(200);
});

// PORT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("Server running on port", PORT);
});
