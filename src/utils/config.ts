import "@std/dotenv/load";

export interface PolarisConfig {
  baseUrl: string;
  apiToken: string;
}

export function loadConfig(): PolarisConfig {
  const baseUrl = Deno.env.get("POLARIS_URL");
  const apiToken = Deno.env.get("POLARIS_API_TOKEN");

  if (!baseUrl) {
    throw new Error("POLARIS_URL environment variable is required");
  }
  if (!apiToken) {
    throw new Error("POLARIS_API_TOKEN environment variable is required");
  }

  return {
    baseUrl: baseUrl.replace(/\/+$/, ""),
    apiToken,
  };
}
