import { loadConfig } from "./config.ts";
import { initClient } from "../api/client.ts";

export function ensureClient(): void {
  const config = loadConfig();
  initClient(config);
}
