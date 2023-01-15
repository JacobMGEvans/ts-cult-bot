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

export const CreateJobPosting: Command = {
  name: "create-job-posting",
  description: "Request posting a job for Mod approval",
  type: ApplicationCommandType.ChatInput,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (_client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("createJobPostingModalID")
      .setTitle("Create Job Posting");

    const jobTitle = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobTitle")
      .setLabel("Job Title")
      .setStyle(TextInputStyle.Short);

    const contactMethod = new TextInputBuilder()
      .setRequired(true)
      .setPlaceholder("<email>@domain.com, Discord DM, etc.")
      .setCustomId("contactMethod")
      .setLabel("Contact Method")
      .setStyle(TextInputStyle.Short);

    const jobDescription = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobDescription")
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

            await prisma.jobs.create({
              data: {
                title: fields.fields.get("jobTitle")?.value ?? "",
                description: fields.fields.get("jobDescription")?.value ?? "",
                application: fields.fields.get("contactMethod")?.value ?? "",
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
            });

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
