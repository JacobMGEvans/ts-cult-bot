/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
} from "discord.js";

import type { CommandInteraction, Client } from "discord.js";

import type { Command } from "../command";

export const RepostMessage: Command = {
  name: "repost-message",
  description:
    "Inform a user to repost their message to a different channel and deletes old one",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["BanMembers", "KickMembers"],
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description:
        "Inform this user that they need to repost their recent message",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.Channel,
      name: "channel",
      description: "The channel that the message needs to reposted to",
      required: true,
    },
    {
      type: ApplicationCommandOptionType.String,
      name: "message",
      description: "The Message ID that needs to repost",
      required: true,
    },
  ],
  run: async (_: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Get the information from the options that the MODERATOR provided
    const messageID = interaction.options.getString("message")!; // The message object
    const channel = interaction.options.getChannel("channel")!; // The channel object
    const user = interaction.options.getUser("user")!; // The user object

    await interaction.deferReply({ ephemeral: true });
    // Message the `user` that they need to move their message to the `channel` and the message will be deleted in 5 minutes automatically.
    await interaction.channel?.messages
      .fetch(messageID)
      .then(async (message) => {
        await message.reply({
          content: `${user} repost this message to ${channel}, the message in this channel will be deleted in 5 minutes`,
        });

        // Delete the message in the current channel
        await new Promise((resolve) =>
          setTimeout(async () => {
            await message.delete().then(resolve);
            // 5 minutes
          }, 300000)
        );
      });

    await interaction.deleteReply();
  },
};
