# API Contract

## Purpose

Map provisioning action to Aibot Agent API HTTP route.

## Base Rules

1. Base path: `/v1/agent-api`
2. Auth: `Authorization: Bearer <agent_api_key>`
3. Caller must be `provider_type=3` and `status=active`.
4. Route must pass scope middleware before service business checks.

## Action Mapping (v1)

| Tool | Method | Route | Required Scope |
|---|---|---|---|
| `grix_agent_admin` | `POST` | `/agents/create` | `agent.api.create` |

## Payload Template

```json
{
  "agentName": "ops-assistant",
  "avatarUrl": "https://example.com/avatar.png"
}
```

`agentName` validation rule for this skill:

- regex: `^[a-z][a-z0-9-]{2,31}$`
- only lowercase English letters, digits, and hyphen

## Success Payload Highlights

```json
{
  "code": 0,
  "data": {
    "id": "2029786829095440384",
    "agent_name": "ops-assistant",
    "provider_type": 3,
    "api_endpoint": "ws://host/v1/agent-api/ws?agent_id=2029786829095440384",
    "api_key": "ak_2029786829095440384_xxx",
    "api_key_hint": "xxxxxx12"
  }
}
```

## Error Matrix

| HTTP/BizCode | Meaning | Skill Response |
|---|---|---|
| `403/20011` | `agent.api.create` scope missing | Ask owner to grant scope |
| `401/10001` | invalid or missing auth | Check `api_key` and account config |
| `403/10002` | caller agent inactive / invalid provider | Ask owner to activate caller agent |
| `409/20002` | duplicate agent name | Ask user for another `agent_name` |
| `400/20004` | owner quota exceeded | Ask owner to clean up unused agents |
| `400/10003` | invalid payload | Ask for corrected parameters |

## Retry Policy

1. Never auto-retry `agent_api_create` unless user explicitly confirms.
2. Do not retry scope/auth/parameter failures.
3. Network transient errors can be retried once after explicit confirmation.

## Post-Create Handover

After `code=0`, return the explicit next-step commands for:

1. `openclaw plugins install @dhf-openclaw/grix && openclaw plugins enable grix`
2. `openclaw channels add --channel grix ...`
3. `openclaw gateway restart`
