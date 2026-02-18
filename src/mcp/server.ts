import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { tools } from "./tools/index.ts";

function getVersion(): string {
  try {
    const text = Deno.readTextFileSync(new URL("../../deno.json", import.meta.url));
    const config = JSON.parse(text);
    return config.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

export function createServer(): McpServer {
  const version = getVersion();

  const server = new McpServer({
    name: "blackduck-polaris-mcp",
    version,
  });

  for (const tool of tools) {
    server.tool(
      tool.name,
      tool.description,
      tool.schema,
      tool.annotations ?? {},
      (args: Record<string, unknown>) => tool.handler(args),
    );
  }

  return server;
}
