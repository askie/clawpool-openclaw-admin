import type { AnyAgentTool, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { registerGrixAdminCli } from "./src/cli.js";
import { createGrixAgentAdminTool } from "./src/agent-admin-tool.js";
import { createGrixGroupTool } from "./src/group-tool.js";
import { createGrixQueryTool } from "./src/query-tool.js";

function emptyPluginConfigSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {},
  } as const;
}

const plugin = {
  id: "grix-admin",
  name: "Grix Admin",
  description: "Typed optional admin tools and operator CLI for Grix",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerTool(createGrixQueryTool(api) as AnyAgentTool, { optional: true });
    api.registerTool(createGrixGroupTool(api) as AnyAgentTool, { optional: true });
    api.registerTool(createGrixAgentAdminTool(api) as AnyAgentTool, { optional: true });
    api.registerCli(({ program }) => registerGrixAdminCli({ api, program }), {
      commands: ["grix-admin"],
    });
  },
};

export default plugin;
