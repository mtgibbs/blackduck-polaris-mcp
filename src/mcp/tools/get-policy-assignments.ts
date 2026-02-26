import { z } from "zod";
import { getPolicyAssignments } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  filter: z
    .string()
    .describe(
      "REQUIRED: RSQL filter expression for policy assignments (e.g., policyId=='uuid' or associationId=='uuid'). The API requires a filter parameter.",
    ),
  offset: z
    .number()
    .optional()
    .describe("Offset for pagination (default 0)"),
  limit: z
    .number()
    .optional()
    .describe("Maximum number of results per page (max 100)"),
};

export const getPolicyAssignmentsTool: ToolDefinition<typeof schema> = {
  name: "get_policy_assignments",
  description:
    "List policy assignments in Polaris. Policy assignments link policies to projects. Use filter parameter to query by policyId or associationId (e.g., policyId=='<uuid>' or associationId=='<uuid>'). Note: Up to 5 issue policies can be assigned per project, but only 1 test scheduling policy per project. Filter parameter is REQUIRED by the API.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ filter, offset, limit }) => {
    const assignments = await getPolicyAssignments({
      filter,
      offset,
      limit,
    });
    return jsonResponse(assignments);
  },
};
