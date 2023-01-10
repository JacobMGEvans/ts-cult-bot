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
    // if (interaction.commandName === 'create-job-posting') {

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("Create Job Posting");

    const jobDescription = new TextInputBuilder()
      .setCustomId("jobDescription")
      .setLabel("Describe the job for the posting.")
      .setStyle(TextInputStyle.Paragraph);

    const firstTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        jobDescription
      );

    modal.addComponents(firstTextActionRow);

    await interaction.showModal(modal);

    // if ((interaction as any).customId === 'myModal') {
    //     await interaction.reply({ content: 'Your submission was received successfully!' });
    // }
    // await interaction.followUp({
    //     ephemeral: true,
    //     content
    // });
  },
};
