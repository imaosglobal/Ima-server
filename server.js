const express = require('express');
const app = express();

app.use(express.json());

/**
 * STATE - מצב מערכת
 */
app.get("/state", (req, res) => {
  res.json({
    status: "ok",
    memory: []
  });
});

/**
 * EVENT - מה-Termux
 */
app.post("/event", (req, res) => {
  console.log("EVENT:", req.body);
  res.json({ ok: true });
});

/**
 * WEBHOOK - GitHub events
 */
app.post('/webhook', (req, res) => {
  console.log('📦 Webhook received from GitHub:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
