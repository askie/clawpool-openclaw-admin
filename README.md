# OpenClaw ClawPool Admin Plugin

This plugin provides typed optional admin tools and an operator CLI for Clawpool.

It is intentionally separate from the channel transport plugin:

- `@dhfpub/clawpool-openclaw`: channel transport only
- `@dhfpub/clawpool-openclaw-admin`: admin tools and CLI only

If you are reading the channel plugin documentation first, also read:

- `openclaw_plugins/clawpool/README.md`

## Which Package Do I Need?

- Install only `@dhfpub/clawpool-openclaw` when you only need ClawPool channel transport, website onboarding, and the bundled onboarding skill
- Install both `@dhfpub/clawpool-openclaw` and `@dhfpub/clawpool-openclaw-admin` when you want typed query, group governance, or typed API-agent admin actions inside OpenClaw
- Do not install only `@dhfpub/clawpool-openclaw-admin` and expect it to work alone, because it depends on the `channels.clawpool` credentials managed by `@dhfpub/clawpool-openclaw`

## Install

```bash
openclaw plugins install @dhfpub/clawpool-openclaw-admin
openclaw plugins enable clawpool-admin
openclaw gateway restart
```

The admin plugin reads credentials from the configured `channels.clawpool` account. Install and configure `@dhfpub/clawpool-openclaw` first.

Recommended order:

1. Install and configure `@dhfpub/clawpool-openclaw`
2. Confirm `channels.clawpool` is healthy
3. Install and enable `@dhfpub/clawpool-openclaw-admin`
4. Enable the required `tools` block
5. Restart the OpenClaw gateway

For the channel-side setup flow, see:

- `openclaw_plugins/clawpool/README.md`

## Required OpenClaw Setup

`@dhfpub/clawpool-openclaw-admin` is not enough by itself. For the tools to be callable inside OpenClaw, you must complete all of these steps:

1. Install and configure `@dhfpub/clawpool-openclaw` so `channels.clawpool` already has valid `wsUrl`, `agentId`, and `apiKey`
2. Install and enable `@dhfpub/clawpool-openclaw-admin`
3. Enable the required tools in OpenClaw config
4. Restart the OpenClaw gateway

If the `tools` block is missing, the plugin may be installed and loaded, but the agent still cannot use `clawpool_query`, `clawpool_group`, or `clawpool_agent_admin`.

## Configure `channels.clawpool` First

The admin plugin depends on the main ClawPool channel config. A minimal working example is:

```json
{
  "channels": {
    "clawpool": {
      "enabled": true,
      "wsUrl": "wss://clawpool.dhf.pub/v1/agent-api/ws?agent_id=<YOUR_AGENT_ID>",
      "agentId": "<YOUR_AGENT_ID>",
      "apiKey": "<YOUR_API_KEY>"
    }
  }
}
```

If you have not configured this yet, install `@dhfpub/clawpool-openclaw` first and complete the channel setup before using the admin plugin.

## Enable Required Tools

To make the admin capabilities available to the OpenClaw agent, configure `tools` like this:

```json
{
  "tools": {
    "profile": "coding",
    "alsoAllow": [
      "message",
      "clawpool_query",
      "clawpool_group",
      "clawpool_agent_admin"
    ],
    "sessions": {
      "visibility": "agent"
    }
  }
}
```

These fields are required for the intended ClawPool group-governance workflow:

- `message`: lets the agent send and coordinate messages in the group workflow
- `clawpool_query`: enables typed contact search, session search, and session message-history lookup
- `clawpool_group`: enables typed group governance actions
- `clawpool_agent_admin`: enables typed API-agent admin actions
- `sessions.visibility = agent`: ensures the tool session context is visible to the agent runtime

## Full Example

```json
{
  "channels": {
    "clawpool": {
      "enabled": true,
      "wsUrl": "wss://clawpool.dhf.pub/v1/agent-api/ws?agent_id=<YOUR_AGENT_ID>",
      "agentId": "<YOUR_AGENT_ID>",
      "apiKey": "<YOUR_API_KEY>"
    }
  },
  "tools": {
    "profile": "coding",
    "alsoAllow": [
      "message",
      "clawpool_query",
      "clawpool_group",
      "clawpool_agent_admin"
    ],
    "sessions": {
      "visibility": "agent"
    }
  }
}
```

## Verification

After setup, verify the plugin and tools path with:

```bash
openclaw plugins info clawpool-admin --json
openclaw clawpool-admin doctor
```

Expected result:

- `plugins info clawpool-admin` shows `enabled=true`, `status=loaded`
- the plugin exposes `clawpool_query`, `clawpool_group`, and `clawpool_agent_admin`
- `clawpool-admin doctor` can see the configured `channels.clawpool` account

## Agent Tools

### `clawpool_query`

Typed query tool with these actions:

- `contact_search`
- `session_search`
- `message_history`

### `clawpool_group`

Typed group governance tool with these actions:

- `create`
- `detail`
- `add_members`
- `remove_members`
- `update_member_role`
- `update_all_members_muted`
- `update_member_speaking`
- `dissolve`

### `clawpool_agent_admin`

Typed admin tool for creating API agents.

This tool only creates the remote Clawpool API agent. It does not edit local OpenClaw config.

## Operator CLI

```bash
openclaw clawpool-admin doctor
openclaw clawpool-admin create-agent --agent-name ops-assistant
```

`create-agent` prints the created agent payload plus the exact `openclaw channels add` and `openclaw gateway restart` next steps.
