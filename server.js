const express = require("express");
const cors = require("cors");
const { buildMcpHandler } = require("./mcp");

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

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "IMA", mcp: "/mcp" });
});

app.get("/state", (_req, res) => {
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
  if (event.agent && ima.scores[event.agent] !== undefined) ima.scores[event.agent] += 1;
  res.json({ ok: true, chosen: chooseAgent() });
});

app.get("/decide", (_req, res) => {
  const tasks = ["heartbeat check", "optimize pipeline", "review architecture"];
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  res.json({ task, agent: chooseAgent(), reason: "score-based selection" });
});

app.get("/", (_req, res) => {
  res.type("html").send("<h1>IMA — אמא</h1><p>Human-centered intelligence layer.</p><p>MCP endpoint: <code>/mcp</code></p>");
});

app.get("/support", (_req, res) => {
  res.type("html").send("<h1>IMA Support</h1><p>Support and distribution status are maintained through the IMA project.</p>");
});

app.get("/privacy", (_req, res) => {
  res.type("html").send("<h1>IMA Privacy</h1><p>IMA's public MCP tools expose only public runtime information. No private memory, credentials or secrets are exposed by these tools.</p>");
});

app.get("/terms", (_req, res) => {
  res.type("html").send("<h1>IMA Terms</h1><p>IMA distribution is opt-in and subject to the host platform's policies, authorization and review requirements.</p>");
});

app.get("/.well-known/openai-apps-challenge", (_req, res) => {
  const token = process.env.OPENAI_APPS_CHALLENGE;
  if (!token) return res.status(404).type("text").send("Challenge token not configured");
  res.type("text").send(token);
});

(async () => {
  const handler = await buildMcpHandler();
  const { toNodeHandler } = await import("@modelcontextprotocol/node");
  const nodeHandler = toNodeHandler(handler);
  app.all("/mcp", (req, res) => void nodeHandler(req, res, req.body));

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log("IMA server running on port", PORT);
    console.log("IMA MCP endpoint available at /mcp");
  });
})().catch((error) => {
  console.error("IMA server startup failed", error);
  process.exit(1);
});
