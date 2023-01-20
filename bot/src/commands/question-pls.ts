import { ApplicationCommandType } from "discord.js";
import { prisma } from "../bot";

import type { CommandInteraction, Client } from "discord.js";

import type { Command } from "../command";

export const QuestionPls: Command = {
  name: "questionpls",
  description:
    "Inform a user that they should move their message to #questions",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["BanMembers", "KickMembers"],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Get the information from the replied to message and the user who made the message that was replied to
    const repliedToMessage = interaction.options.get("message");
    console.log(repliedToMessage);

    await interaction.reply("Hello");
  },
};
