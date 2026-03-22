import type {
  ClawpoolAccountConfig,
  ClawpoolConfig,
  OpenClawCoreConfig,
  ResolvedClawpoolAccount,
} from "./types.js";

const DEFAULT_ACCOUNT_ID = "default";

function normalizeAccountId(value: unknown): string {
  const normalized = String(value ?? "").trim();
  return normalized || DEFAULT_ACCOUNT_ID;
}

function normalizeOptionalAccountId(value: unknown): string | undefined {
  const normalized = String(value ?? "").trim();
  return normalized || undefined;
}

function rawClawpoolConfig(cfg: OpenClawCoreConfig): ClawpoolConfig {
  return (cfg.channels?.clawpool as ClawpoolConfig | undefined) ?? {};
}

function listConfiguredAccountIds(cfg: OpenClawCoreConfig): string[] {
  const accounts = rawClawpoolConfig(cfg).accounts;
  if (!accounts || typeof accounts !== "object") {
    return [];
  }
  return Object.keys(accounts).filter(Boolean);
}

function normalizeNonEmpty(value: unknown): string {
  return String(value ?? "").trim();
}

function appendAgentIdToWsUrl(rawWsUrl: string, agentId: string): string {
  if (!rawWsUrl) {
    return "";
  }
  const direct = rawWsUrl.replaceAll("{agent_id}", encodeURIComponent(agentId));
  if (!agentId) {
    return direct;
  }

  try {
    const parsed = new URL(direct);
    if (!parsed.searchParams.get("agent_id")) {
      parsed.searchParams.set("agent_id", agentId);
    }
    return parsed.toString();
  } catch {
    if (direct.includes("agent_id=")) {
      return direct;
    }
    return direct.includes("?")
      ? `${direct}&agent_id=${encodeURIComponent(agentId)}`
      : `${direct}?agent_id=${encodeURIComponent(agentId)}`;
  }
}

function resolveWsUrl(merged: ClawpoolAccountConfig, agentId: string): string {
  const envWs = normalizeNonEmpty(process.env.CLAWPOOL_WS_URL);
  const cfgWs = normalizeNonEmpty(merged.wsUrl);
  const ws = cfgWs || envWs;
  if (ws) {
    return appendAgentIdToWsUrl(ws, agentId);
  }
  if (!agentId) {
    return "";
  }
  return `ws://127.0.0.1:27189/v1/agent-api/ws?agent_id=${encodeURIComponent(agentId)}`;
}

function resolveMergedAccountConfig(
  cfg: OpenClawCoreConfig,
  accountId: string,
): ClawpoolAccountConfig {
  const clawpoolCfg = rawClawpoolConfig(cfg);
  const { accounts: _ignoredAccounts, defaultAccount: _ignoredDefault, ...base } = clawpoolCfg;
  const account = clawpoolCfg.accounts?.[accountId] ?? {};
  return {
    ...base,
    ...account,
  };
}

export function listClawpoolAccountIds(cfg: OpenClawCoreConfig): string[] {
  const ids = listConfiguredAccountIds(cfg);
  if (ids.length === 0) {
    return [DEFAULT_ACCOUNT_ID];
  }
  return ids.toSorted((a, b) => a.localeCompare(b));
}

export function resolveDefaultClawpoolAccountId(cfg: OpenClawCoreConfig): string {
  const clawpoolCfg = rawClawpoolConfig(cfg);
  const preferred = normalizeOptionalAccountId(clawpoolCfg.defaultAccount);
  if (
    preferred &&
    listClawpoolAccountIds(cfg).some((accountId) => normalizeAccountId(accountId) === preferred)
  ) {
    return preferred;
  }

  const ids = listClawpoolAccountIds(cfg);
  if (ids.includes(DEFAULT_ACCOUNT_ID)) {
    return DEFAULT_ACCOUNT_ID;
  }
  return ids[0] ?? DEFAULT_ACCOUNT_ID;
}

export function resolveClawpoolAccount(params: {
  cfg: OpenClawCoreConfig;
  accountId?: string | null;
}): ResolvedClawpoolAccount {
  const accountId =
    params.accountId == null || String(params.accountId).trim() === ""
      ? resolveDefaultClawpoolAccountId(params.cfg)
      : normalizeAccountId(params.accountId);
  const merged = resolveMergedAccountConfig(params.cfg, accountId);

  const baseEnabled = rawClawpoolConfig(params.cfg).enabled !== false;
  const accountEnabled = merged.enabled !== false;
  const enabled = baseEnabled && accountEnabled;

  const agentId = normalizeNonEmpty(merged.agentId || process.env.CLAWPOOL_AGENT_ID);
  const apiKey = normalizeNonEmpty(merged.apiKey || process.env.CLAWPOOL_API_KEY);
  const wsUrl = resolveWsUrl(merged, agentId);
  const configured = Boolean(wsUrl && agentId && apiKey);

  return {
    accountId,
    name: normalizeNonEmpty(merged.name) || undefined,
    enabled,
    configured,
    wsUrl,
    agentId,
    apiKey,
    config: merged,
  };
}

export function summarizeClawpoolAccounts(cfg: OpenClawCoreConfig): Array<Record<string, unknown>> {
  return listClawpoolAccountIds(cfg).map((accountId) => {
    const account = resolveClawpoolAccount({ cfg, accountId });
    return {
      accountId: account.accountId,
      name: account.name ?? null,
      enabled: account.enabled,
      configured: account.configured,
      wsUrl: account.wsUrl || null,
      agentId: account.agentId || null,
    };
  });
}
