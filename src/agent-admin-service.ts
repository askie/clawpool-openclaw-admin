import { buildAgentHTTPRequest } from "./agent-api-actions.js";
import { callAgentAPI } from "./agent-api-http.js";
import { resolveClawpoolAccount, summarizeClawpoolAccounts } from "./accounts.js";
import type { OpenClawCoreConfig } from "./types.js";

export type ClawpoolAgentAdminToolParams = {
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
    "--channel clawpool",
    `--name ${JSON.stringify(params.channelName)}`,
    `--http-url ${JSON.stringify(params.apiEndpoint)}`,
    `--user-id ${JSON.stringify(params.agentId)}`,
    `--token ${JSON.stringify(params.apiKey)}`,
  ].join(" ");
}

export async function createClawpoolApiAgent(params: {
  cfg: OpenClawCoreConfig;
  toolParams: ClawpoolAgentAdminToolParams;
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
            "Install and enable the channel plugin if it is not installed yet: `openclaw plugins install @dhf-openclaw/clawpool && openclaw plugins enable clawpool`.",
            `Bind the new API agent to OpenClaw with: \`${buildChannelBootstrapCommand({
              channelName: `clawpool-${agentName}`,
              apiEndpoint,
              agentId,
              apiKey,
            })}\``,
            "Restart the gateway after adding the channel: `openclaw gateway restart`.",
          ]
        : [],
  };
}

export function inspectClawpoolAdminConfig(cfg: OpenClawCoreConfig) {
  return {
    accounts: summarizeClawpoolAccounts(cfg),
    defaultAccountId: resolveClawpoolAccount({ cfg }).accountId,
  };
}
