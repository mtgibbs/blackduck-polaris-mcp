import { z } from "zod";
import { abortGroupImportJob } from "../../services/index.ts";
import { errorResponse, jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  job_id: z.string().describe("The ID of the bulk group import job to abort"),
};

export const abortGroupImportJobTool: ToolDefinition<typeof schema> = {
  name: "abort_group_import_job",
  description: "Abort a running bulk group import job by its ID.",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ job_id }) => {
    try {
      const result = await abortGroupImportJob({ jobId: job_id });
      return jsonResponse(result);
    } catch (err) {
      return errorResponse(err instanceof Error ? err.message : String(err));
    }
  },
};
