import { z } from "zod";
import { getGroupImportJobStatus } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  job_id: z.string().describe("The ID of the bulk group import job"),
};

export const getGroupImportJobStatusTool: ToolDefinition<typeof schema> = {
  name: "get_group_import_job_status",
  description: "Get the status of a bulk group import job by its ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ job_id }) => {
    const result = await getGroupImportJobStatus(job_id);
    return jsonResponse(result);
  },
};
