import { z } from "zod";
import { getTaxonIssueTypes } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  taxon_id: z
    .string()
    .describe("The taxon identifier to retrieve issue types for (e.g. 'ty-1', 'tn-10')"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of issue types to return (default: 100, max: 500)"),
};

export const getTaxonIssueTypesTool: ToolDefinition<typeof schema> = {
  name: "get_taxon_issue_types",
  description:
    "Get the issue types (transitive) belonging to a taxon from the Polaris Findings API. Returns all issue type IDs and localized names covered by the taxon and its descendants.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ taxon_id, max_results }) => {
    const issueTypes = await getTaxonIssueTypes({ taxonId: taxon_id, first: max_results });
    return jsonResponse(issueTypes);
  },
};
