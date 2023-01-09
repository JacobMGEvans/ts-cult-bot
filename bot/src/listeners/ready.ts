import { Client } from "discord.js";
import { Commands } from "../commands";

export default (client: Client): void => {
   client.on("ready", async () => {
       if (!client.user || !client.application) {
           return;
       }

       // register slash commands
       console.log('* - Registering slash commands')
       await client.application.commands.set(Commands);

       console.log(`* - ${client.user.username} is online`);
   });
};