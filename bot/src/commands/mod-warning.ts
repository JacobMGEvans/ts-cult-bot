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
  name: "mod-warning",
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
      .setLabel("Message to Offender")
      .setStyle(TextInputStyle.Paragraph);

    const modNotes = new TextInputBuilder()
      .setCustomId("modNotes")
      .setLabel("Mod Notes/Reason")
      .setRequired(true)
      .setStyle(TextInputStyle.Paragraph);

    const createTextActionRows = (components: TextInputBuilder[]) => {
      return components.map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
          component
        )
      );
    };

    const actionRows = createTextActionRows([
      offendingUser,
      messageToOffender,
      modNotes,
    ]);

    modal.setComponents(actionRows);

    if (!interaction.replied && !interaction.deferred) {
      await interaction.showModal(modal);
      await interaction
        // 0 seems to give it as much time as it needs
        .awaitModalSubmit({ time: 0 })
        .then(async (modalData) => {
          if (modalData) {
            const { user, fields } = modalData;

            //  prisma.warnings.create({})

            /**
             * The deferReply keeps the gate open
             * The initial interaction is the slash command that triggered the modal,
             * editting replaces the "is thinking..." message
             * */
            await modalData.deferReply();
            await modalData.editReply({
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              content: `⚠️ ${user} ⚠️ Mod Message: ${JSON.stringify(
                fields.fields.get("messageToOffender")?.value
              )}!
              Warning Count: ${1} 
              `,
            });
          }
        });
    }
  },
};
