import type { AnyAgentTool, OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { emptyPluginConfigSchema } from "openclaw/plugin-sdk/core";
import { registerClawpoolAdminCli } from "./src/cli.js";
import { createClawpoolAgentAdminTool } from "./src/agent-admin-tool.js";
import { createClawpoolGroupTool } from "./src/group-tool.js";
import { createClawpoolQueryTool } from "./src/query-tool.js";

const plugin = {
  id: "clawpool-admin",
  name: "Clawpool Admin",
  description: "Typed optional admin tools and operator CLI for Clawpool",
  configSchema: emptyPluginConfigSchema(),
  register(api: OpenClawPluginApi) {
    api.registerTool(createClawpoolQueryTool(api) as AnyAgentTool, { optional: true });
    api.registerTool(createClawpoolGroupTool(api) as AnyAgentTool, { optional: true });
    api.registerTool(createClawpoolAgentAdminTool(api) as AnyAgentTool, { optional: true });
    api.registerCli(({ program }) => registerClawpoolAdminCli({ api, program }), {
      commands: ["clawpool-admin"],
    });
  },
};

export default plugin;
