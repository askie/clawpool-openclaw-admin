import assert from "node:assert/strict";
import test from "node:test";
import {
  listClawpoolAccountIds,
  resolveClawpoolAccount,
  resolveDefaultClawpoolAccountId,
} from "./accounts.ts";

test("resolveDefaultClawpoolAccountId prefers explicit defaultAccount", () => {
  const cfg = {
    channels: {
      clawpool: {
        defaultAccount: "ops",
        accounts: {
          ops: {
            wsUrl: "wss://clawpool.dhf.pub/v1/agent-api/ws",
            agentId: "1001",
            apiKey: "ak_ops",
          },
          backup: {
            wsUrl: "wss://clawpool.dhf.pub/v1/agent-api/ws",
            agentId: "1002",
            apiKey: "ak_backup",
          },
        },
      },
    },
  } as never;

  assert.equal(resolveDefaultClawpoolAccountId(cfg), "ops");
  assert.deepEqual(listClawpoolAccountIds(cfg), ["backup", "ops"]);
});

test("resolveClawpoolAccount merges base and account-scoped config", () => {
  const account = resolveClawpoolAccount({
    cfg: {
      channels: {
        clawpool: {
          wsUrl: "wss://clawpool.dhf.pub/v1/agent-api/ws",
          accounts: {
            ops: {
              agentId: "1001",
              apiKey: "ak_ops",
            },
          },
        },
      },
    } as never,
    accountId: "ops",
  });

  assert.equal(account.accountId, "ops");
  assert.equal(account.configured, true);
  assert.match(account.wsUrl, /agent_id=1001/);
});
