import { CommandInteraction, Client, ApplicationCommandType } from "discord.js";
import { Command } from "../command";

export const Hello: Command = {
    name: "hello",
    description: "Sample command - Returns a greeting",
    type: ApplicationCommandType.ChatInput,
    run: async (client: Client, interaction: CommandInteraction) => {
        const content = "Hello there!";

        await interaction.followUp({
            ephemeral: true,
            content
        });
    }
};