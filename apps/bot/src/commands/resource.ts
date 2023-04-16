import { CommandInteraction, Interaction } from "discord.js";
import { SlashCommandBuilder } from '@discordjs/builders'

// Command to list all ResourceType entries
const listCommand = new SlashCommandBuilder()
  .setName('resources')
  .setDescription('List all ResourceType entries');

// Command to search for ResourceType entries that match a term
const searchCommand = new SlashCommandBuilder()
  .setName('resources')
  .setDescription('Search for ResourceType entries')
  .addStringOption(option =>
    option.setName('term')
      .setDescription('The term to search for')
      .setRequired(true)
  );

// Command to grab all matching resources by type and display list
const resourceCommand = new SlashCommandBuilder()
  .setName('resource')
  .setDescription('Grab all matching resources by type and display list')
  .addStringOption(option =>
    option.setName('type')
      .setDescription('The ResourceType to search for')
      .setRequired(true)
  );

// Map each command to a function that will handle the command
const commandMap = new Map([
  [listCommand.name, handleListCommand],
  [searchCommand.name, handleSearchCommand],
  [resourceCommand.name, handleResourceCommand]
]);

// Handler function for the "List all ResourceType entries" command
async function handleListCommand(interaction: CommandInteraction) {
  // TODO: Implement logic to list all ResourceType entries
}

// Handler function for the "Search for ResourceType entries" command
async function handleSearchCommand(interaction: CommandInteraction) {
  const term = interaction.options.get('term');
  // TODO: Implement logic to search for ResourceType entries that match the provided term
}

// Handler function for the "Grab all matching resources by type and display list" command
async function handleResourceCommand(interaction: CommandInteraction) {
  const type = interaction.options.get('type');
  // TODO: Implement logic to grab all matching resources by type and display list
}

//Could be used in apps/bot/src/command.ts or listener.ts to handle the commands 
// async function handleSlashCommand(interaction: CommandInteraction) {
//   const commandName = interaction.commandName;
//   const handler = commandMap.get(commandName);
//   if (handler) {
//     await handler(interaction);
//   }
// }