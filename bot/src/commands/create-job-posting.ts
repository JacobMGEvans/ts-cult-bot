import {
  CommandInteraction,
  Client,
  ApplicationCommandType,
  ModalBuilder,
  TextInputStyle,
  TextInputBuilder,
  ActionRowBuilder,
  ModalActionRowComponentBuilder,
  Events,
} from "discord.js";
import { Command } from "../command";

export const CreateJobPosting: Command = {
  name: "create-job-posting",
  description: "Request posting a job for Mod approval",
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    // if (interaction.commandName === 'create-job-posting') {

    // Create the modal
    const modal = new ModalBuilder()
      .setCustomId("myModal")
      .setTitle("Create Job Posting");

    const jobDescription = new TextInputBuilder()
      .setCustomId("jobDescription")
      .setLabel("Describe the job for the posting.")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstTextActionRow =
      new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
        jobDescription
      );

    // Add inputs to the modal
    modal.addComponents(firstTextActionRow);

    // Show the modal to the user
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
