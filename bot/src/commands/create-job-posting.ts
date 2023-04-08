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
                status: "opened",
                user: {
                  connectOrCreate: {
                    where: {
                      id: user.id,
                    },
                    // TODO the image is still hackish, but it works for now
                    // we either need a table for non-webapp users or we need to add a row to the Account table as well
                    // Account
                    // -> id: auto created
                    // -> userId -> id of row from User table
                    // -> type -> probably can use 'bot-generated'
                    // -> providerAccountId -> discord id (currently user.id)
                    // User
                    // -> id: auto created
                    // -> name: same as currently
                    // -> image: see below for URL created, or https://cdn.discordapp.com/avatars/520297539115810826/bb2f0816cf5002fb054cd16bd6f6251a.png

                    create: {
                      id: user?.id,
                      name: user?.username,
                      imageURL: `https://cdn.discordapp.com/avatars/${
                        user?.id
                      }/${user.avatarURL()}.png`,
                    },
                  },
                },
              },
              include: {
                user: true,
              },
            });

            if (jobCreationResponse) {
              const rowApproveAndDeny =
                new ActionRowBuilder<ButtonBuilder>().addComponents(
                  new ButtonBuilder()
                    .setCustomId("rowApproveID")
                    .setLabel("Appprove")
                    .setStyle(ButtonStyle.Success),
                  new ButtonBuilder()
                    .setCustomId("rowDenyID")
                    .setLabel("Deny")
                    .setStyle(ButtonStyle.Danger)
                );

              // In the Mod Channel create a message with a Approve and Deny button
              const modChannel = await client.channels.fetch(
                process.env.JOB_POSTS_MODERATION_CHANNEL_ID ?? ""
              );
              if (modChannel instanceof TextChannel) {
                await modChannel.send({
                  content: `New Job Posting: ${jobCreationResponse.title}`,
                  embeds: [
                    {
                      description: jobCreationResponse.description,
                      fields: [
                        {
                          name: "Job Title",
                          value: jobCreationResponse.title,
                        },
                        {
                          name: "Contact",
                          value: jobCreationResponse.application,
                        },
                        {
                          name: "User",
                          value: jobCreationResponse.user.name ?? "",
                        },
                        {
                          name: "Date Applied",
                          value: jobCreationResponse.dateAdded.toDateString(),
                        },
                        {
                          name: "Job ID",
                          value: jobCreationResponse.id, 
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
