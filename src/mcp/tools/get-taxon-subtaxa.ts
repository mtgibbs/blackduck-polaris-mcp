import { z } from "zod";
import { getTaxonSubtaxa } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  taxon_id: z.string().describe("The taxon identifier to retrieve subtaxa for (e.g. 'ty-1')"),
  max_results: z
    .number()
    .optional()
    .describe("Maximum number of subtaxa to return (default: 100, max: 500)"),
};

export const getTaxonSubtaxaTool: ToolDefinition<typeof schema> = {
  name: "get_taxon_subtaxa",
  description:
    "Get the subtaxa (transitive descendants) of a taxon from the Polaris Findings API. Useful for exploring a taxonomy tree to find all child categories under a given node.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ taxon_id, max_results }) => {
    const subtaxa = await getTaxonSubtaxa({ taxonId: taxon_id, first: max_results });
    return jsonResponse(subtaxa);
  },
};
