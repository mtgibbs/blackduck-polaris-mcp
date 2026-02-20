import { z } from "zod";
import { updateProfile } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  portfolio_id: z.string().describe("Portfolio ID (get from get_portfolios)"),
  application_id: z.string().describe("Application ID"),
  project_id: z.string().describe("Project ID"),
  profile_id: z.string().describe("Profile ID"),
  body: z.string().describe(
    "JSON string of profile update payload - schema is polymorphic, see specs/portfolio.yaml",
  ),
};

export const updateProfileTool: ToolDefinition<typeof schema> = {
  name: "update_profile",
  description: "Update a profile. The body is polymorphic (forms/saml/selenium/none/import).",
  schema,
  annotations: { readOnlyHint: false, openWorldHint: true },
  handler: async ({ portfolio_id, application_id, project_id, profile_id, body }) => {
    const parsedBody = JSON.parse(body) as Record<string, unknown>;
    const profile = await updateProfile({
      portfolioId: portfolio_id,
      applicationId: application_id,
      projectId: project_id,
      profileId: profile_id,
      body: parsedBody,
    });
    return jsonResponse(profile);
  },
};
