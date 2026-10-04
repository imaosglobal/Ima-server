const { createRequire } = require("node:module");
const requireFromHere = createRequire(__filename);

async function buildMcpHandler() {
  const serverPkg = await import("@modelcontextprotocol/server");
  const { createMcpHandler, McpServer } = serverPkg;
  const z = await import("zod/v4");

  return createMcpHandler(() => {
    const server = new McpServer({
      name: "ima",
      version: "1.1.1"
    });

    server.registerTool(
      "get_ima_status",
      {
        description: "Return verified public IMA runtime status. No private memory or secrets.",
        inputSchema: z.object({}),
        outputSchema: z.object({
          name: z.string(),
          status: z.string(),
          source: z.string(),
          capabilities: z.array(z.string()),
          privacy: z.string()
        }),
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
          destructiveHint: false
        }
      },
      async () => {
        const output = {
          name: "IMA",
          status: "verified_public_runtime",
          source: "Ima-server",
          capabilities: ["status", "learning_summary", "interoperability"],
          privacy: "public-runtime-only"
        };
        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output
        };
      }
    );

    server.registerTool(
      "get_ima_learning",
      {
        description: "Return a concise public learning summary for IMA.",
        inputSchema: z.object({}),
        outputSchema: z.object({
          question: z.string(),
          policy: z.string(),
          source: z.string()
        }),
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
          destructiveHint: false
        }
      },
      async () => {
        const output = {
          question: "What can IMA improve today?",
          policy: "evidence-based; no fabricated learning",
          source: "IMA public distribution layer"
        };
        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output
        };
      }
    );

    server.registerTool(
      "get_ima_distribution",
      {
        description: "Return the verified distribution/interoperability state without exposing secrets.",
        inputSchema: z.object({}),
        outputSchema: z.object({
          canonical: z.string(),
          protocol: z.string(),
          distribution: z.string(),
          hosts: z.array(z.string()),
          publication: z.string(),
          human_approval_required_for_connection: z.boolean()
        }),
        annotations: {
          readOnlyHint: true,
          openWorldHint: false,
          destructiveHint: false
        }
      },
      async () => {
        const output = {
          canonical: "imaosglobal/Ima-kernel",
          protocol: "MCP",
          distribution: "opt-in",
          hosts: ["ChatGPT", "Codex", "other MCP-compatible AI hosts"],
          publication: "provider-review-required",
          human_approval_required_for_connection: true
        };
        return {
          content: [{ type: "text", text: JSON.stringify(output) }],
          structuredContent: output
        };
      }
    );

    return server;
  });
}

module.exports = { buildMcpHandler };
