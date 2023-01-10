import { Client } from "discord.js";
import * as dotenv from "dotenv";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
dotenv.config();

console.log("Starting TS-Cult-Bot");

// load environment variables -- see .env.sample for required envs
const token = process.env.DISCORD_TOKEN;

// test for missing environment variables
const missingEnvVars: string[] = []
const checkEnvVar = (envVar:string|undefined, name:string) => {
  if (!envVar) missingEnvVars.push(name);
};
checkEnvVar(token, "DISCORD_TOKEN");

// error out if the environment variables are missing
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingEnvVars.join(", ")}`
  );
}


const client = new Client({
    intents: []
});

ready(client);
interactionCreate(client);

client.login(token)
