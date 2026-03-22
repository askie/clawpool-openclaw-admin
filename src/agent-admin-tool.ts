import type { AnyAgentTool, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { createClawpoolApiAgent } from "./agent-admin-service.js";
import { jsonToolResult } from "./json-result.js";

export const ClawpoolAgentAdminToolSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    accountId: { type: "string", minLength: 1 },
    agentName: {
      type: "string",
      pattern: "^[a-z][a-z0-9-]{2,31}$",
      description: "Lowercase API agent name.",
    },
    avatarUrl: { type: "string", minLength: 1 },
  },
  required: ["agentName"],
} as const;

export function createClawpoolAgentAdminTool(api: OpenClawPluginApi) {
  return {
    name: "clawpool_agent_admin",
    label: "Clawpool Agent Admin",
    description:
      "Create Clawpool API agents with typed parameters. This tool does not modify local OpenClaw channel config.",
    parameters: ClawpoolAgentAdminToolSchema,
    async execute(_toolCallId: string, params: Record<string, unknown>) {
      try {
        return jsonToolResult(
          await createClawpoolApiAgent({
            cfg: api.config as Record<string, unknown>,
            toolParams: params,
          }),
        );
      } catch (err) {
        return jsonToolResult({
          error: err instanceof Error ? err.message : String(err),
        });
      }
    },
  } as AnyAgentTool;
}
