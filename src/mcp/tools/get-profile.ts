import { z } from "zod";
import { getProfile } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  profile_id: z.string().describe("Profile ID"),
};

export const getProfileTool: ToolDefinition<typeof schema> = {
  name: "get_profile",
  description: "Get a single profile by ID.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, profile_id }) => {
    const profile = await getProfile({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      profileId: profile_id,
    });
    return jsonResponse(profile);
  },
};
