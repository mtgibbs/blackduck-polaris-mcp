import { z } from "zod";
import { getScmProviders } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  _placeholder: z.string().optional().describe("No parameters required"),
};

export const getScmProvidersTool: ToolDefinition<typeof schema> = {
  name: "get_scm_providers",
  description: "List available SCM providers supported by the Polaris Repos integration.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async () => {
    const providers = await getScmProviders();
    return jsonResponse(providers);
  },
};
