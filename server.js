const express = require('express');
const app = express();
app.use(express.json());

app.post('/webhook', (req, res) => {
  console.log('📦 Webhook received from GitHub:', req.body);
  res.sendStatus(200);
});

const PORT = process.env.PORT;
app.get('/', (req, res) => {
  res.send('Ima Server is running ✅');
});
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
