/* eslint-disable import/no-anonymous-default-export */
import { Commands } from "../commands";
import type {
  CommandInteraction,
  Client,
  Interaction,
  ButtonInteraction,
} from "discord.js";

export default (client: Client): void => {
  client.on("debug", (info) => {
    console.dir(info, { depth: Infinity });
  });
  client.on("interactionCreate", async (interaction: Interaction) => {
    const modChannel = await client.channels.fetch(
      process.env.JOB_POSTS_MODERATION_CHANNEL_ID ?? ""
    );
    // Slash Commands and User Context Menu Handlers
    if (interaction.isCommand() || interaction.isUserContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
    // Buttons in Mod Channel Handler
    if (interaction.isButton() && interaction.channel === modChannel) {
      await handleButtonsInModChannel(client, interaction);
    }
  });
};

const handleSlashCommand = async (
  client: Client,
  interaction: CommandInteraction
): Promise<void> => {
  const slashCommand = Commands.find(
    ({ name }) => name === interaction.commandName
  );

  if (!slashCommand) {
    await interaction.followUp({ content: "An error has occurred" });
    return;
  }

  slashCommand.run(client, interaction);
};

const handleButtonsInModChannel = async (
  client: Client,
  interaction: ButtonInteraction
): Promise<void> => {
  console.dir(interaction, { depth: Infinity });
  await Promise.resolve();
  // const collector = message.createMessageComponentCollector({
  //   componentType: ComponentType.Button,
  //   time: 15000,
  // });
};

// collector.on("collect", (i) => {
//   if (i.user.id === interaction.user.id) {
//     i.reply(`${i.user.id} clicked on the ${i.customId} button.`);
//   } else {
//     i.reply({ content: `These buttons aren't for you!`, ephemeral: true });
//   }
// });

// collector.on("end", (collected) => {
//   console.log(`Collected ${collected.size} interactions.`);
// });
