---
name: clawpool-agent-admin
description: 创建 Clawpool Agent（机器人/分身）。触发词：创建 agent、新建机器人、创建分身、新建一个号、create agent。当用户要求创建新的 Clawpool agent 时调用此技能，自动完成 API 创建和本地 OpenClaw 配置绑定。
---

# Clawpool Agent Admin

Create a new `provider_type=3` agent through Aibot Agent API, and optionally bind it to local OpenClaw config.

## Required Input

1. Require `agentName` from user.
2. Accept only English lowercase + digits + hyphen.
3. Enforce regex: `^[a-z][a-z0-9-]{2,31}$`.
4. Reject Chinese, uppercase, underscore, and spaces.

## Workflow

### Phase 1: Create API Agent

1. Ask user for `agentName` when missing.
2. Validate `agentName` with the regex above before any tool call.
3. Call `clawpool_agent_admin` once with `agentName` and optional `accountId` / `avatarUrl`.
4. Return the created agent details.

### Phase 2: Bind to OpenClaw (Auto)

After successful API agent creation, automatically bind to local OpenClaw:

1. **Add Agent Config**: Add entry to `agents.list` in `~/.openclaw/openclaw.json`
   - `id`: agentName
   - `name`: agentName
   - `workspace`: `~/.openclaw/workspace-{agentName}`
   - `agentDir`: `~/.openclaw/agents/{agentName}/agent`
   - `model`: use default model from `agents.defaults.model.primary`

2. **Add Channel Account**: Add entry to `channels.clawpool.accounts`
   - Key: agentName
   - `name`: agentName
   - `enabled`: true
   - `apiKey`: from API response
   - `wsUrl`: from API response `api_endpoint`
   - `agentId`: from API response `id`

3. **Add Binding**: Add route binding to `bindings`
   - `type`: "route"
   - `agentId`: agentName
   - `match.channel`: "clawpool"
   - `match.accountId`: agentName

4. **Create Workspace**: Create workspace directory with default files
   - Create `~/.openclaw/workspace-{agentName}/`
   - Create `AGENTS.md` with basic agent description
   - Create `MEMORY.md` with owner info
   - Create `USER.md` referencing the owner

5. **Restart Gateway**: Run `openclaw gateway restart` to apply changes

## Tool Contract

Tool: `clawpool_agent_admin`

Purpose: create an API-type agent under current owner.

Request payload:

1. `agentName` (required, validated by regex)
2. `avatarUrl` (optional)
3. `accountId` (optional, when multiple Clawpool accounts are configured)

Guardrails:

1. Treat create action as non-idempotent; never auto-retry without user confirmation.
2. Expose `api_key` only once in success output; mask it in any later logs.
3. Do not auto-grant extra scopes to the new agent.
4. Check if agent config already exists before adding to avoid duplicates.
5. Backup `openclaw.json` before modification.

## OpenClaw Config Template

### agents.list entry:
```json
{
  "id": "{agentName}",
  "name": "{agentName}",
  "workspace": "/Users/{username}/.openclaw/workspace-{agentName}",
  "agentDir": "/Users/{username}/.openclaw/agents/{agentName}/agent",
  "model": "{defaultModel}"
}
```

### channels.clawpool.accounts entry:
```json
"{agentName}": {
  "name": "{agentName}",
  "enabled": true,
  "apiKey": "{apiKey}",
  "wsUrl": "{api_endpoint}",
  "agentId": "{agent_id}"
}
```

### bindings entry:
```json
{
  "type": "route",
  "agentId": "{agentName}",
  "match": {
    "channel": "clawpool",
    "accountId": "{agentName}"
  }
}
```

## Error Handling Rules

1. Name regex check failed: ask user to provide a valid English name.
2. `403/20011`: missing `agent.api.create` scope, ask owner to grant this scope.
3. `401/10001`: invalid or missing `agent_api_key`, ask to verify config/rotate key.
4. `403/10002`: caller agent inactive or invalid provider type.
5. `409/20002`: duplicate agent name; ask user for another name.
6. `400/20004`: owner quota exceeded; ask owner to clean up agents.
7. Config write failure: report error and provide manual steps.
8. Other errors: return backend `msg` and stop automatic retries.

## Response Style

1. Return `created` status first.
2. Include `agent_id`, `agent_name`, `api_endpoint`, and `api_key_hint`.
3. Show `api_key` once, then only show `api_key_hint`.
4. Report OpenClaw binding status: which configs were added/updated.
5. Confirm gateway restart status.

## References

1. Load [references/api-contract.md](references/api-contract.md) for API mapping and error matrix.
