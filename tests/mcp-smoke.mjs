import { Client, StreamableHTTPClientTransport } from "@modelcontextprotocol/client";

const url = process.env.IMA_MCP_URL || "http://127.0.0.1:3000/mcp";
const client = new Client({ name: "ima-mcp-smoke", version: "1.0.0" }, {
  versionNegotiation: { mode: "auto" }
});

await client.connect(new StreamableHTTPClientTransport(new URL(url)));

const listed = await client.listTools();
const names = listed.tools.map((tool) => tool.name);
const expected = ["get_ima_status", "get_ima_learning", "get_ima_distribution"];

for (const name of expected) {
  if (!names.includes(name)) throw new Error(`Missing MCP tool: ${name}`);
}

for (const name of expected) {
  const result = await client.callTool({ name, arguments: {} });
  if (result.isError) throw new Error(`MCP tool failed: ${name}`);
  if (!result.structuredContent) throw new Error(`Missing structuredContent: ${name}`);
}

console.log(JSON.stringify({
  ok: true,
  url,
  protocolEra: client.getProtocolEra(),
  protocolVersion: client.getNegotiatedProtocolVersion(),
  tools: names
}, null, 2));

await client.close();
