import { Client } from "discord.js";
import * as dotenv from "dotenv";
import ready from "./listeners/ready";
import interactionCreate from "./listeners/interactionCreate";
import { PrismaClient } from "@prisma/client";

// grab the discord token from the .env.discord file
// will this work in prod?
dotenv.config({ path: ".env" });
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;

// reset to general env vars for other stuff
// also, will this work in prod?
dotenv.config({ path: "../.env" });
console.log("discord token: ", process.env.DATABASE_URL);

export const prisma = new PrismaClient();

console.log("Starting TS-Cult-Bot");

// load environment variables -- see .env.sample for required envs
// const token = process.env.DISCORD_TOKEN;

// test for missing environment variables
const missingEnvVars: string[] = [];
const checkEnvVar = (envVar: string | undefined, name: string) => {
  if (!envVar) missingEnvVars.push(name);
};
checkEnvVar(DISCORD_TOKEN, "DISCORD_TOKEN");

// error out if the environment variables are missing
if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingEnvVars.join(", ")}`
  );
}

const client = new Client({
  intents: [],
});

ready(client);
interactionCreate(client);

void client.login(DISCORD_TOKEN);
