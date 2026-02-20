import { z } from "zod";
import { getTestProfiles } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID to fetch DAST profile details for"),
};

export const getTestProfilesTool: ToolDefinition<typeof schema> = {
  name: "get_test_profiles",
  description: "Fetch DAST profile details for a test. DAST-specific endpoint.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ test_id }) => {
    const profile = await getTestProfiles({ testId: test_id });
    return jsonResponse(profile);
  },
};
