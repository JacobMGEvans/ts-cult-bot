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
import { PrismaClient } from "@prisma/client";
import type { Command } from "../command";

const prisma = new PrismaClient();

export const CreateJobPosting: Command = {
  name: "create-job-posting",
  description: "Request posting a job for Mod approval",
  type: ApplicationCommandType.ChatInput,
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  run: async (_client: Client, interaction: CommandInteraction) => {
    if (!interaction.isChatInputCommand()) return;

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("Create Job Posting");

    const jobTitle = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobTitle")
      .setLabel("Job Title")
      .setStyle(TextInputStyle.Short);

    const contactMethod = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("contactMethod")
      .setLabel("Contact Method")
      .setStyle(TextInputStyle.Short);

    const jobDescription = new TextInputBuilder()
      .setRequired(true)
      .setCustomId("jobDescription")
      .setLabel("Job Description")
      .setStyle(TextInputStyle.Paragraph);

    const firstTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        jobTitle
      );
    const secondTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        contactMethod
      );
    const thirdTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().setComponents(
        jobDescription
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
            console.log({ user, fields });

           await prisma.jobs.create({
              data: {
                title: fields.fields.get("jobTitle")?.value ?? "",
                description: fields.fields.get("jobDescription")?.value ?? "",
                application: fields.fields.get("contactMethod")?.value ?? "",
                dateAdded: new Date(),
                // contact: fields.fields.get("contactMethod")?.value ?? "",
                user: {
                  connect: {
                    id: user?.id,
                    // name: user?.username,
                    // email: "",
                    // emailVerified: "",
                    // image: user.avatar,
                  },
                },
              },
              include: {
                user: true,
              },
            });

            // The initial interaction is the slash command that triggered the modal, editting replaces the "is thinking..." message
            await modalData.deferReply();
            await modalData.editReply({
              content: `Thanks ${user} for submitting! ${JSON.stringify(
                fields.fields.get("jobTitle")
              )}`,
            });
          }
        });
    }
  },
};
