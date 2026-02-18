import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ensureClient } from "./src/utils/init.ts";
import { createServer } from "./src/mcp/server.ts";

ensureClient();

const server = createServer();
const transport = new StdioServerTransport();
await server.connect(transport);
