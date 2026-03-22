import { buildAgentHTTPRequest } from "./agent-api-actions.js";
import { callAgentAPI } from "./agent-api-http.js";
import { resolveClawpoolAccount } from "./accounts.js";
import type { OpenClawCoreConfig } from "./types.js";

export const CLAWPOOL_QUERY_TOOL_ACTIONS = [
  "contact_search",
  "session_search",
  "message_history",
] as const;

export type ClawpoolQueryToolAction = (typeof CLAWPOOL_QUERY_TOOL_ACTIONS)[number];

export type ClawpoolQueryToolParams = {
  action: ClawpoolQueryToolAction;
  accountId?: string;
  id?: string;
  sessionId?: string;
  beforeId?: string;
  limit?: number;
  offset?: number;
};

function mapQueryActionToRequestAction(action: ClawpoolQueryToolAction) {
  switch (action) {
    case "contact_search":
      return "contact_search" as const;
    case "session_search":
      return "session_search" as const;
    case "message_history":
      return "message_history" as const;
    default:
      action satisfies never;
      throw new Error(`Unsupported Clawpool query action: ${String(action)}`);
  }
}

export async function runClawpoolQueryAction(params: {
  cfg: OpenClawCoreConfig;
  toolParams: ClawpoolQueryToolParams;
}) {
  const account = resolveClawpoolAccount({
    cfg: params.cfg,
    accountId: params.toolParams.accountId,
  });
  if (!account.enabled) {
    throw new Error(`Clawpool account "${account.accountId}" is disabled.`);
  }
  if (!account.configured) {
    throw new Error(`Clawpool account "${account.accountId}" is not configured.`);
  }

  const requestAction = mapQueryActionToRequestAction(params.toolParams.action);
  const request = buildAgentHTTPRequest(requestAction, params.toolParams);
  const data = await callAgentAPI({
    account,
    actionName: request.actionName,
    method: request.method,
    path: request.path,
    query: request.query,
    body: request.body,
  });

  return {
    ok: true,
    accountId: account.accountId,
    action: params.toolParams.action,
    data,
  };
}
