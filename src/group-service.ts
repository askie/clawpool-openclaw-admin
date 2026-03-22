import { buildAgentHTTPRequest } from "./agent-api-actions.js";
import { callAgentAPI } from "./agent-api-http.js";
import { resolveClawpoolAccount } from "./accounts.js";
import type { OpenClawCoreConfig } from "./types.js";

export const CLAWPOOL_GROUP_TOOL_ACTIONS = [
  "create",
  "detail",
  "add_members",
  "remove_members",
  "update_member_role",
  "update_all_members_muted",
  "update_member_speaking",
  "dissolve",
] as const;

export type ClawpoolGroupToolAction = (typeof CLAWPOOL_GROUP_TOOL_ACTIONS)[number];

export type ClawpoolGroupToolParams = {
  action: ClawpoolGroupToolAction;
  accountId?: string;
  name?: string;
  sessionId?: string;
  memberIds?: string[];
  memberTypes?: number[];
  memberId?: string;
  memberType?: number;
  role?: number;
  allMembersMuted?: boolean;
  isSpeakMuted?: boolean;
  canSpeakWhenAllMuted?: boolean;
};

function mapGroupActionToRequestAction(action: ClawpoolGroupToolAction) {
  switch (action) {
    case "create":
      return "group_create" as const;
    case "detail":
      return "group_detail_read" as const;
    case "add_members":
      return "group_member_add" as const;
    case "remove_members":
      return "group_member_remove" as const;
    case "update_member_role":
      return "group_member_role_update" as const;
    case "update_all_members_muted":
      return "group_all_members_muted_update" as const;
    case "update_member_speaking":
      return "group_member_speaking_update" as const;
    case "dissolve":
      return "group_dissolve" as const;
    default:
      action satisfies never;
      throw new Error(`Unsupported Clawpool group action: ${String(action)}`);
  }
}

export async function runClawpoolGroupAction(params: {
  cfg: OpenClawCoreConfig;
  toolParams: ClawpoolGroupToolParams;
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

  const requestAction = mapGroupActionToRequestAction(params.toolParams.action);
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
