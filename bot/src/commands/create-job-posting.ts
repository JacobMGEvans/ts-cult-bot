import type {
  CommandInteraction,
  Client,
  ModalActionRowComponentBuilder,
} from "discord.js";
import {
  ActionRowBuilder,
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextChannel,
  TextInputStyle,
  TextInputBuilder,
} from "discord.js";
import type { Command } from "../command";
import { prisma } from "../bot";
import * as dotenv from "dotenv";

dotenv.config();

export const CreateJobPosting: Command = {
  name: "create-job-posting",
  description: "Request posting a job for Mod approval",
  type: ApplicationCommandType.ChatInput,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("createJobPostingModalID")
      .setTitle("Create Job Posting");

    const jobTitle = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobTitleID")
      .setLabel("Job Title")
      .setStyle(TextInputStyle.Short);

    const contactMethod = new TextInputBuilder()
      .setRequired(true)
      .setPlaceholder("<email>@domain.com, Discord DM, etc.")
      .setCustomId("contactMethodID")
      .setLabel("Contact Method")
      .setStyle(TextInputStyle.Short);

    const jobDescription = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobDescriptionID")
      .setLabel("Job Description")
      .setStyle(TextInputStyle.Paragraph);

    const createTextActionRows = (components: TextInputBuilder[]) => {
      return components.map((component) =>
        new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
          component
        )
      );
    };

    const actionRows = createTextActionRows([
      jobTitle,
      contactMethod,
      jobDescription,
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

            const jobCreationResponse = await prisma.jobs.create({
              data: {
                title: fields.fields.get("jobTitleID")?.value ?? "",
                description: fields.fields.get("jobDescriptionID")?.value ?? "",
                application: fields.fields.get("contactMethodID")?.value ?? "",
                dateAdded: new Date(),
                user: {
                  connectOrCreate: {
                    where: {
                      id: user.id,
                    },
                    create: {
                      id: user?.id,
                      name: user?.username,
                      image: user.avatarURL(),
                    },
                  },
                },
              },
              include: {
                user: true,
              },
            });

            if (jobCreationResponse) {
              const rowApproveAndDeny = new ActionRowBuilder<ButtonBuilder>()
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("rowApproveID")
                    .setLabel("Appprove")
                    .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                  new ButtonBuilder()
                    .setCustomId("rowDenyID")
                    .setLabel("Deny")
                    .setStyle(ButtonStyle.Danger)
                );

              // In the Mod Channel create a message with a Approve and Deny button (maybe have a datapoint for the decision)
              const modChannel = await client.channels.fetch(
                process.env.JOB_POSTS_MODERATION_CHANNEL_ID ?? ""
              );
              if (modChannel instanceof TextChannel) {
                await modChannel.send({
                  content: `New Job Posting: ${jobCreationResponse.title}`,
                  embeds: [
                    {
                      title: jobCreationResponse.title,
                      description: jobCreationResponse.description,
                      fields: [
                        {
                          name: "Contact",
                          value: jobCreationResponse.application,
                        },
                        {
                          name: "User",
                          value: jobCreationResponse.user.name ?? "",
                        },
                      ],
                    },
                  ],
                  components: [rowApproveAndDeny],
                });
              }
            }
            /**
             * The deferReply keeps the gate open
             * The initial interaction is the slash command that triggered the modal,
             * editting replaces the "is thinking..." message
             * */
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
