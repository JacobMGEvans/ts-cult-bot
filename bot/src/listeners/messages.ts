import type { Client } from "discord.js";

export function messages(client: Client): void {
  client.on("messageCreate", async (message) => {
    if (!message.content.startsWith("!") || message.author.bot) return;

    console.log(message);
    await message.reply("Hello World!");
  });
}
