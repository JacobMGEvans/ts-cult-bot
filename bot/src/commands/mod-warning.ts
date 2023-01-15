import type {
  CommandInteraction,
  Client,
  ModalActionRowComponentBuilder,
} from "discord.js";
import {
  ApplicationCommandType,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} from "discord.js";
import type { Command } from "../command";
import { prisma } from "../bot";

export const ModWarning: Command = {
  name: "Mod Warning",
  description: "Warn a user for breaking the rules & track their infractions",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["BanMembers", "KickMembers"],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (_client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("modWarningModalID")
      .setTitle("Create Job Posting");

    const offendingUser = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("offendingUser")
      .setLabel("Offending User")
      .setStyle(TextInputStyle.Short);

    const messageToOffender = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("messageToOffender")
      .setPlaceholder("<email>@domain.com, Discord DM, etc.")
      .setLabel("messageToOffender")
      .setStyle(TextInputStyle.Paragraph);

    const modNotes = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("modNotes")
      .setLabel("modNotes")
      .setStyle(TextInputStyle.Paragraph);

    const firstTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        offendingUser
      );
    const secondTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        messageToOffender
      );
    const thirdTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        modNotes
      );

    modal.setComponents(
      firstTextActionRow,
      secondTextActionRow,
      thirdTextActionRow
    );

    if (!interaction.replied && !interaction.deferred) {
      await interaction.showModal(modal);
      await interaction
        // 0 seems to give it as much time as it needs
        .awaitModalSubmit({ time: 0 })
        .then(async (modalData) => {
          if (modalData) {
            const { user, fields } = modalData;

            //  prisma.warnings.create({})

            // The initial interaction is the slash command that triggered the modal, editting replaces the "is thinking..." message
            await modalData.deferReply({ ephemeral: true });
            await modalData.editReply({
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              content: `Thanks ${user} for submitting job posting ${JSON.stringify(
                fields.fields.get("jobTitle")?.value
              )}! Mods will review it shortly.`,
            });
          }
        });
    }
  },
};
