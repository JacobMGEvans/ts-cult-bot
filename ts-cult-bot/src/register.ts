import * as dotenv from "dotenv";
dotenv.config();

// TODO - Figure out how to get this to work on a Route on the CF Worker
const CREATE_JOB_POST = {
  name: "create-job-post",
  description: "Request to mods to create a job post",
};

const token = process.env.DISCORD_TOKEN as string;
const applicationId = process.env.DISCORD_APPLICATION_ID as string;
const testGuildId = process.env.DISCORD_GUILD_ID as string;

const missingEnvVars: string[] = [];
const checkEnvVar = (envVar: string | undefined, name: string) => {
  if (!envVar) missingEnvVars.push(name);
};

checkEnvVar(token, "DISCORD_TOKEN");
checkEnvVar(applicationId, "DISCORD_APPLICATION_ID");
checkEnvVar(testGuildId, "DISCORD_TEST_GUILD_ID");

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing environment variables: ${missingEnvVars.join(", ")}`
  );
}

async function registerGuildCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands`;
  const res = await registerCommands(url);
  const json = await res.json();
  console.log(json);
  json.forEach(async (cmd) => {
    const response = await fetch(
      `https://discord.com/api/v10/applications/${applicationId}/guilds/${testGuildId}/commands/${cmd.id}`
    );
    if (!response.ok) {
      console.error(`Problem removing command ${cmd.id}`);
    }
  });
}

async function registerGlobalCommands() {
  const url = `https://discord.com/api/v10/applications/${applicationId}/commands`;
  await registerCommands(url);
}

async function registerCommands(url) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bot ${token}`,
    },
    method: "PUT",
    body: JSON.stringify([CREATE_JOB_POST]),
  });

  if (response.ok) {
    console.log("Registered all commands");
  } else {
    console.error("Error registering commands");
    const text = await response.text();
    console.error(text);
  }
  return response;
}

// await registerGlobalCommands();
await registerGuildCommands();
export {};
