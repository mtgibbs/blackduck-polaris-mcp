import { z } from "zod";
import { getTestComments } from "../../services/index.ts";
import { jsonResponse, type ToolDefinition } from "../types.ts";

export const schema = {
  test_id: z.string().describe("Test ID to fetch comments for"),
};

export const getTestCommentsTool: ToolDefinition<typeof schema> = {
  name: "get_test_comments",
  description:
    "Fetch comments for a test. Returns up to 500 comments sorted by created date descending.",
  schema,
  annotations: { readOnlyHint: true, openWorldHint: true },
  handler: async ({ test_id }) => {
    const comments = await getTestComments({ testId: test_id });
    return jsonResponse(comments);
  },
};
