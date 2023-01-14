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
      .setCustomId("jobTitle")
      .setLabel("Job Title")
      .setStyle(TextInputStyle.Short);

    const contactMethod = new TextInputBuilder()
      .setCustomId("contactMethod")
      .setLabel("Contact Method")
      .setStyle(TextInputStyle.Short);

    const jobDescription = new TextInputBuilder()
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
        .awaitModalSubmit({ time: 0 })
        .then(async (modalData) => {
          if (modalData) {
            const { user, fields } = modalData;

            console.log({ user, fields });

            await modalData.deferReply();
            await interaction.followUp({
              content: `Thanks ${user} for submitting! ${JSON.stringify(
                fields
              )}`,
            });
          }
        });
    }
  },
};
