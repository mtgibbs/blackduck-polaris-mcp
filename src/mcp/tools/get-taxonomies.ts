import { z } from "zod";
import { getTaxonomies } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  include_descendants: z
    .boolean()
    .optional()
    .describe(
      "Include all descendant taxa instead of just child taxa (default: false)",
    ),
  include_only_standards: z
    .boolean()
    .optional()
    .describe("Include only standard taxonomies such as OWASP (default: false)"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of taxonomies to return (default: 100, max: 500)"),
};

export const getTaxonomiesTool: ToolDefinition<typeof schema> = {
  name: "get_taxonomies",
  description:
    "Get a list of taxonomies (classification systems) from the Polaris Findings API. Taxonomies group issue types into categories like OWASP, CWE Top 25, etc. Use include_descendants to retrieve the full tree.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ include_descendants, include_only_standards, max_results }) => {
    const taxonomies = await getTaxonomies({
      includeDescendants: include_descendants,
      includeOnlyStandards: include_only_standards,
      first: max_results,
    });
    return jsonResponse(taxonomies);
  },
};
