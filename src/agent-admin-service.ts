import { buildAgentHTTPRequest } from "./agent-api-actions.js";
import { callAgentAPI } from "./agent-api-http.js";
import { resolveGrixAccount, summarizeGrixAccounts } from "./accounts.js";
import type { OpenClawCoreConfig } from "./types.js";

export type GrixAgentAdminToolParams = {
  accountId?: string;
  agentName?: string;
  avatarUrl?: string;
};

function buildChannelBootstrapCommand(params: {
  channelName: string;
  apiEndpoint: string;
  agentId: string;
  apiKey: string;
}): string {
  return [
    "openclaw channels add",
    "--channel grix",
    `--name ${JSON.stringify(params.channelName)}`,
    `--http-url ${JSON.stringify(params.apiEndpoint)}`,
    `--user-id ${JSON.stringify(params.agentId)}`,
    `--token ${JSON.stringify(params.apiKey)}`,
  ].join(" ");
}

export async function createGrixApiAgent(params: {
  cfg: OpenClawCoreConfig;
  toolParams: GrixAgentAdminToolParams;
}) {
  const account = resolveGrixAccount({
    cfg: params.cfg,
    accountId: params.toolParams.accountId,
  });
  if (!account.enabled) {
    throw new Error(`Grix account "${account.accountId}" is disabled.`);
  }
  if (!account.configured) {
    throw new Error(`Grix account "${account.accountId}" is not configured.`);
  }

  const request = buildAgentHTTPRequest("agent_api_create", params.toolParams);
  const data = (await callAgentAPI({
    account,
    actionName: request.actionName,
    method: request.method,
    path: request.path,
    query: request.query,
    body: request.body,
  })) as Record<string, unknown>;

  const agentName = String(data.agent_name ?? params.toolParams.agentName ?? "").trim();
  const apiEndpoint = String(data.api_endpoint ?? "").trim();
  const agentId = String(data.id ?? "").trim();
  const apiKey = String(data.api_key ?? "").trim();

  return {
    ok: true,
    accountId: account.accountId,
    action: "create_api_agent",
    data,
    nextSteps:
      agentName && apiEndpoint && agentId && apiKey
        ? [
            "Install and enable the channel plugin if it is not installed yet: `openclaw plugins install @dhf-openclaw/grix && openclaw plugins enable grix`.",
            `Bind the new API agent to OpenClaw with: \`${buildChannelBootstrapCommand({
              channelName: `grix-${agentName}`,
              apiEndpoint,
              agentId,
              apiKey,
            })}\``,
            "Restart the gateway after adding the channel: `openclaw gateway restart`.",
          ]
        : [],
  };
}

export function inspectGrixAdminConfig(cfg: OpenClawCoreConfig) {
  return {
    accounts: summarizeGrixAccounts(cfg),
    defaultAccountId: resolveGrixAccount({ cfg }).accountId,
  };
}
