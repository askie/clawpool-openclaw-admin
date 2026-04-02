import type { Command } from "commander";
import type { OpenClawPluginApi } from "openclaw/plugin-sdk/core";
import { createGrixApiAgent, inspectGrixAdminConfig } from "./agent-admin-service.js";

export function registerGrixAdminCli(params: {
  api: OpenClawPluginApi;
  program: Command;
}) {
  const root = params.program
    .command("grix-admin")
    .description("Grix admin utilities")
    .addHelpText(
      "after",
      "\nThis CLI is for operator workflows. Agent tools stay scoped to typed remote admin actions only.\n",
    );

  root
    .command("doctor")
    .description("Show the Grix accounts visible from the current OpenClaw config")
    .action(() => {
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(inspectGrixAdminConfig(params.api.config as never), null, 2));
    });

  root
    .command("create-agent")
    .description("Create a Grix API agent and print the exact next steps for channel binding")
    .requiredOption("--agent-name <name>", "New API agent name")
    .option("--account-id <id>", "Configured Grix account id")
    .option("--avatar-url <url>", "Optional avatar URL")
    .action(
      async (options: {
        accountId?: string;
        agentName: string;
        avatarUrl?: string;
      }) => {
        const result = await createGrixApiAgent({
          cfg: params.api.config as never,
          toolParams: options,
        });
        // eslint-disable-next-line no-console
        console.log(JSON.stringify(result, null, 2));
      },
    );
}
