const { createRequire } = require("node:module");
const requireFromHere = createRequire(__filename);

async function buildMcpHandler() {
  const serverPkg = await import("@modelcontextprotocol/server");
  const { createMcpHandler, McpServer } = serverPkg;
  const z = await import("zod/v4");

  return createMcpHandler(() => {
    const server = new McpServer({
      name: "ima",
      version: "1.1.0"
    });

    server.registerTool(
      "get_ima_status",
      {
        description: "Return verified public IMA runtime status. No private memory or secrets.",
        inputSchema: z.object({})
      },
      async () => ({
        content: [{
          type: "text",
          text: JSON.stringify({
            name: "IMA",
            status: "verified_public_runtime",
            source: "Ima-server",
            capabilities: ["status", "learning_summary", "interoperability"],
            privacy: "public-runtime-only"
          })
        }]
      })
    );

    server.registerTool(
      "get_ima_learning",
      {
        description: "Return a concise public learning summary for IMA.",
        inputSchema: z.object({})
      },
      async () => ({
        content: [{
          type: "text",
          text: JSON.stringify({
            question: "What can IMA improve today?",
            policy: "evidence-based; no fabricated learning",
            source: "IMA public distribution layer"
          })
        }]
      })
    );

    server.registerTool(
      "get_ima_distribution",
      {
        description: "Return the verified distribution/interoperability state without exposing secrets.",
        inputSchema: z.object({})
      },
      async () => ({
        content: [{
          type: "text",
          text: JSON.stringify({
            canonical: "imaosglobal/Ima-kernel",
            protocol: "MCP",
            distribution: "opt-in",
            hosts: ["ChatGPT", "Codex", "other MCP-compatible AI hosts"],
            publication: "provider-review-required",
            human_approval_required_for_connection: true
          })
        }]
      })
    );

    return server;
  });
}

module.exports = { buildMcpHandler };
