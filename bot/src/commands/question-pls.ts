import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";
import { prisma } from "../bot";

import type { CommandInteraction, Client } from "discord.js";

import type { Command } from "../command";

export const QuestionPls: Command = {
  name: "questionpls",
  description:
    "Inform a user that they should move their message to the correct channel",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["BanMembers", "KickMembers"],
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description:
        "Inform this user that they should move their recent message",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel that the message needs to move to",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "The Message ID that needs to move",
      required: true,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Get the information from the replied to message and the user who made the message that was replied to
    const repliedToMessage = interaction;
    console.log(repliedToMessage);

    await interaction.reply("Hello");
  },
};
