export type ClawpoolAccountConfig = {
  enabled?: boolean;
  name?: string;
  wsUrl?: string;
  agentId?: string | number;
  apiKey?: string;
};

export type ClawpoolConfig = ClawpoolAccountConfig & {
  defaultAccount?: string;
  accounts?: Record<string, ClawpoolAccountConfig>;
};

export type OpenClawCoreConfig = {
  channels?: {
    clawpool?: ClawpoolConfig;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export type ResolvedClawpoolAccount = {
  accountId: string;
  name?: string;
  enabled: boolean;
  configured: boolean;
  wsUrl: string;
  agentId: string;
  apiKey: string;
  config: ClawpoolAccountConfig;
};

export type AgentToolResult = {
  content: Array<{ type: "text"; text: string }>;
  details?: unknown;
};
