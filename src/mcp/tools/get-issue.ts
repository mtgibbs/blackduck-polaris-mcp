import { z } from "zod";
import { getIssue } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  issue_id: z.string().describe("Issue ID to retrieve"),
  application_id: z.string().optional().describe("Application ID for scoping"),
  project_id: z.string().optional().describe("Project ID for scoping"),
  branch_id: z.string().optional().describe("Branch ID for scoping"),
  test_id: z.string().optional().describe("Test ID or 'latest' for scoping"),
  include_issue_exclusion: z
    .boolean()
    .optional()
    .describe("Include issue exclusion data in the response"),
  include_extension_properties: z
    .boolean()
    .optional()
    .describe("Include extension properties in the response"),
};

export const getIssueTool: ToolDefinition<typeof schema> = {
  name: "get_issue",
  description:
    "Get a single security issue by ID. Returns the issue with its type, context, occurrence properties, triage state, and component locations.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({
    issue_id,
    application_id,
    project_id,
    branch_id,
    test_id,
    include_issue_exclusion,
    include_extension_properties,
  }) => {
    const issue = await getIssue({
      issueId: issue_id,
      applicationId: application_id,
      projectId: project_id,
      branchId: branch_id,
      testId: test_id,
      includeIssueExclusion: include_issue_exclusion,
      includeExtensionProperties: include_extension_properties,
    });
    return jsonResponse(issue);
  },
};
