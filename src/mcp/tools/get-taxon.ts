import { z } from "zod";
import { getTaxon } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  taxon_id: z.string().describe("The taxon identifier (e.g. 'tn-1', 'ty-6')"),
};

export const getTaxonTool: ToolDefinition<typeof schema> = {
  name: "get_taxon",
  description:
    "Get details of a single taxon by ID from the Polaris Findings API. Returns the taxon's localized name, issue type names, subtaxa IDs, and whether it is a root taxon.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ taxon_id }) => {
    const taxon = await getTaxon(taxon_id);
    return jsonResponse(taxon);
  },
};
