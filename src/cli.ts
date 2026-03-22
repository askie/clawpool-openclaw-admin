import type { Command } from "commander";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { createClawpoolApiAgent, inspectClawpoolAdminConfig } from "./agent-admin-service.js";

export function registerClawpoolAdminCli(params: {
  api: OpenClawPluginApi;
  program: Command;
}) {
  const root = params.program
    .command("clawpool-openclaw-admin")
    .description("Clawpool admin utilities")
    .addHelpText(
      "after",
      "\nThis CLI is for operator workflows. Agent tools stay scoped to typed remote admin actions only.\n",
    );

  root
    .command("doctor")
    .description("Show the Clawpool accounts visible from the current OpenClaw config")
    .action(() => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(inspectClawpoolAdminConfig(params.api.config as never), null, 2));
    });

  root
    .command("create-agent")
    .description("Create a Clawpool API agent and print the exact next steps for channel binding")
    .requiredOption("--agent-name <name>", "New API agent name")
    .option("--account-id <id>", "Configured Clawpool account id")
    .option("--avatar-url <url>", "Optional avatar URL")
    .action(
      async (options: {
        accountId?: string;
        agentName: string;
        avatarUrl?: string;
      }) => {
        const result = await createClawpoolApiAgent({
          cfg: params.api.config as never,
          toolParams: options,
        });
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(result, null, 2));
      },
    );
}
