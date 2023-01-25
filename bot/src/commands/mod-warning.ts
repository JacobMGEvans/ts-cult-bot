/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
} from "discord.js";
import { prisma } from "../bot";

import type {
  CommandInteraction,
  Client,
  ModalActionRowComponentBuilder,
} from "discord.js";
import type { Command } from "../command";

export const ModWarning: Command = {
  name: "mod-warning",
  description: "Warn a user for breaking the rules & track their infractions",
  type: ApplicationCommandType.ChatInput,
  defaultMemberPermissions: ["BanMembers", "KickMembers"],
  options: [
    {
      type: ApplicationCommandOptionType.User,
      name: "user",
      description: "The user that needs to be warned",
      required: true,
    },
  ],
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    const textInputsConfig = [
      {
        id: "messageToOffender",
        label: "Message to Offender",
        style: TextInputStyle.Paragraph,
      },
      {
        id: "modNotes",
        label: "Mod Notes/Reason",
        style: TextInputStyle.Paragraph,
      },
    ];

    const modal = new ModalBuilder()
      .setCustomId("modWarningModalID")
      .setTitle("Warning A User For Server Infraction");

    const textInputsBuilt = textInputsConfig.map(({ id, label, style }) => {
      return new TextInputBuilder()
        .setCustomId(id)
        .setLabel(label)
        .setStyle(style)
        .setRequired(true);
    });

    const createTextActionRows = (components: TextInputBuilder[]) => {
      return components.map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
          component
        )
      );
    };

    const actionRows = createTextActionRows(textInputsBuilt);

    modal.setComponents(actionRows);

    if (!interaction.replied && !interaction.deferred) {
      const user = interaction.options.getUser("user")!; // The user object, option is required
      await interaction.showModal(modal);
      await interaction
        // 0 seems to give it as much time as it needs
        .awaitModalSubmit({ time: 0 })
        .then(async (modalData) => {
          if (modalData) {
            const { fields } = modalData;

            if (!user) {
              await modalData.deferReply({ ephemeral: true });
              await modalData.editReply({
                content: `Error: User not found in server member search`,
              });
              return;
            }

            await prisma.warnings.create({
              data: {
                reason: JSON.stringify(fields.fields.get("modNotes")?.value),
                dateAdded: new Date(),
                admin: {
                  connectOrCreate: {
                    where: {
                      id: user.id,
                    },
                    create: {
                      id: user.id,
                      name: user.username,
                      image: user.avatarURL(),
                    },
                  },
                },
                user: {
                  connectOrCreate: {
                    where: {
                      id: user.id,
                    },
                    create: {
                      id: user.id,
                      name: user.username,
                      image: user.avatarURL(),
                    },
                  },
                },
              },
            });

            const warningsByUser = await prisma.warnings.findMany({
              where: { userId: user.id },
            });
            /**
             * The deferReply keeps the gate open
             * The initial interaction is the slash command that triggered the modal,
             * editting replaces the "is thinking..." message
             * */
            await modalData.deferReply();
            await modalData.editReply({
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              content: `⚠️ ${user} ⚠️ 
              **Mod Message**: ${JSON.stringify(
                fields.fields.get("messageToOffender")?.value
              )}
              **Warning Count**: ${warningsByUser.length} 
              `,
            });
          }
        });
    }
  },
};
