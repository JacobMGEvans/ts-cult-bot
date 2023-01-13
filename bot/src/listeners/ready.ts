/* eslint-disable import/no-anonymous-default-export */
import { Commands } from "../commands";
import type { Client } from "discord.js";

export default (client: Client): void => {
  client.on("ready", async () => {
    if (!client.user || !client.application) {
      return;
    }

    // register slash commands
    console.log("* - Registering slash commands");
    await client.application.commands.set(Commands);

    console.log(`* - ${client.user.username} is online`);
  });
};
