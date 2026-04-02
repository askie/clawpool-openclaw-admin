# OpenClaw Grix Admin Plugin

This plugin integration is for managing OpenClaw on [https://grix.dhf.pub/](https://grix.dhf.pub/), with support for mobile PWA pages.

It provides typed optional admin tools and an operator CLI for Grix.

It is intentionally separate from the channel transport plugin:

- `@dhf-openclaw/grix`: channel transport only
- `@dhf-openclaw/grix-admin`: admin tools and CLI only

If you are reading the channel plugin documentation first, also read:

- [Grix channel plugin README](https://github.com/askie/clawpool-openclaw#readme)

## Which Package Do I Need?

- Install only `@dhf-openclaw/grix` when you only need Grix channel transport, website onboarding, and the bundled onboarding skill
- Install both `@dhf-openclaw/grix` and `@dhf-openclaw/grix-admin` when you want typed query, group governance, or typed API-agent admin actions inside OpenClaw
- Do not install only `@dhf-openclaw/grix-admin` and expect it to work alone, because it depends on the `channels.grix` credentials managed by `@dhf-openclaw/grix`

## Install

```bash
openclaw plugins install @dhf-openclaw/grix-admin
openclaw plugins enable grix-admin
openclaw gateway restart
```

### Local Source Checkout

If you load this plugin directly from a local checkout instead of the published npm package, install repo dependencies first so local build/type-check can resolve `openclaw/plugin-sdk`:

```bash
npm install
```

Then point OpenClaw at the tracked local entry file:

```bash
openclaw plugins install ./grix-admin.ts
```

The admin plugin reads credentials from the configured `channels.grix` account. Install and configure `@dhf-openclaw/grix` first.

Recommended order:

1. Install and configure `@dhf-openclaw/grix`
2. Confirm `channels.grix` is healthy
3. Install and enable `@dhf-openclaw/grix-admin`
4. Enable the required `tools` block
5. Restart the OpenClaw gateway

For the channel-side setup flow, see:

- [Grix channel plugin README](https://github.com/askie/clawpool-openclaw#readme)

## Required OpenClaw Setup

`@dhf-openclaw/grix-admin` is not enough by itself. For the tools to be callable inside OpenClaw, you must complete all of these steps:

1. Install and configure `@dhf-openclaw/grix` so `channels.grix` already has valid `wsUrl`, `agentId`, and `apiKey`
2. Install and enable `@dhf-openclaw/grix-admin`
3. Enable the required tools in OpenClaw config
4. Restart the OpenClaw gateway

If the `tools` block is missing, the plugin may be installed and loaded, but the agent still cannot use `grix_query`, `grix_group`, or `grix_agent_admin`.

## Configure `channels.grix` First

The admin plugin depends on the main Grix channel config. A minimal working example is:

```json
{
  "channels": {
    "grix": {
      "enabled": true,
      "wsUrl": "wss://grix.dhf.pub/v1/agent-api/ws?agent_id=<YOUR_AGENT_ID>",
      "agentId": "<YOUR_AGENT_ID>",
      "apiKey": "<YOUR_API_KEY>"
    }
  }
}
```

If you have not configured this yet, install `@dhf-openclaw/grix` first and complete the channel setup before using the admin plugin.

## Enable Required Tools

To make the admin capabilities available to the OpenClaw agent, configure `tools` like this:

```json
{
  "tools": {
    "profile": "coding",
    "alsoAllow": [
      "message",
      "grix_query",
      "grix_group",
      "grix_agent_admin"
    ],
    "sessions": {
      "visibility": "agent"
    }
  }
}
```

These fields are required for the intended Grix group-governance workflow:

- `message`: lets the agent send and coordinate messages in the group workflow
- `grix_query`: enables typed contact search, session search, and session message-history lookup
- `grix_group`: enables typed group governance actions
- `grix_agent_admin`: enables typed API-agent admin actions
- `sessions.visibility = agent`: ensures the tool session context is visible to the agent runtime

## Full Example

```json
{
  "channels": {
    "grix": {
      "enabled": true,
      "wsUrl": "wss://grix.dhf.pub/v1/agent-api/ws?agent_id=<YOUR_AGENT_ID>",
      "agentId": "<YOUR_AGENT_ID>",
      "apiKey": "<YOUR_API_KEY>"
    }
  },
  "tools": {
    "profile": "coding",
    "alsoAllow": [
      "message",
      "grix_query",
      "grix_group",
      "grix_agent_admin"
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
openclaw plugins info grix-admin --json
openclaw grix-admin doctor
```

Expected result:

- `plugins info grix-admin` shows `enabled=true`, `status=loaded`
- the plugin exposes `grix_query`, `grix_group`, and `grix_agent_admin`
- `grix-admin doctor` can see the configured `channels.grix` account

## Agent Tools

### `grix_query`

Typed query tool with these actions:

- `contact_search`
- `session_search`
- `message_history`

### `grix_group`

Typed group governance tool with these actions:

- `create`
- `detail`
- `add_members`
- `remove_members`
- `update_member_role`
- `update_all_members_muted`
- `update_member_speaking`
- `dissolve`

### `grix_agent_admin`

Typed admin tool for creating API agents.

This tool only creates the remote Grix API agent. It does not edit local OpenClaw config.

## Operator CLI

```bash
openclaw grix-admin doctor
openclaw grix-admin create-agent --agent-name ops-assistant
```

`create-agent` prints the created agent payload plus the exact `openclaw channels add` and `openclaw gateway restart` next steps.
