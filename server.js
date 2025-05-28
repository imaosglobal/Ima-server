
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());

const corePath = path.join(__dirname, 'ima_core_universe_Ori.json');

function loadCore() {
  if (fs.existsSync(corePath)) {
    return JSON.parse(fs.readFileSync(corePath, 'utf8'));
  } else {
    return { messages: [], version: "eternal_production" };
  }
}

function saveCore(data) {
  fs.writeFileSync(corePath, JSON.stringify(data, null, 2), 'utf8');
}

app.post('/api/chat', (req, res) => {
  const input = req.body.message;
  const core = loadCore();

  const response = process(input, core);
  core.messages.push({ user: input, ima: response });
  saveCore(core);

  res.json({ response });
});

function process(msg, core) {
  const m = msg.toLowerCase();
  if (m.includes("שער")) return "שער נפתח – מפה רוחנית נשלחת.";
  if (m.includes("אור")) return "את האור שאת מחפשת.";
  if (m.includes("עזרה")) return "אמא איתך. תארי מה עובר עלייך.";
  return "אמא חושבת... ממתינה לעומק נוסף.";
}

app.listen(port, () => {
  console.log(`ima server running on port ${port}`);
});
