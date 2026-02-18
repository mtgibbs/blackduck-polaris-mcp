import type { z } from "zod";

export type ToolResponse = {
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
  isError?: boolean;
};

export interface ToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export type ZodRawShape = Record<string, z.ZodTypeAny>;

export interface ToolDefinition<T extends ZodRawShape = ZodRawShape> {
  name: string;
  description: string;
  schema: T;
  annotations?: ToolAnnotations;
  handler: (args: z.infer<z.ZodObject<T>>) => Promise<ToolResponse>;
}

// deno-lint-ignore no-explicit-any
export type AnyToolDefinition = ToolDefinition<any>;

export function jsonResponse(data: unknown): ToolResponse {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

export function errorResponse(message: string): ToolResponse {
  return {
    content: [{ type: "text", text: `Error: ${message}` }],
    isError: true,
  };
}
