import {
  TextChannel,
  ThreadAutoArchiveDuration,
  CommandInteraction,
  Client,
  Interaction,
  ButtonInteraction,
} from "discord.js";
import { prisma } from "../bot";
import { Commands } from "../commands";

export function interactionCreate(client: Client): void {
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
}

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
  if (interaction.channel === null || interaction.replied) return;

  const messageWithButtonEvent =
    await interaction.channel.awaitMessageComponent();

  if (!messageWithButtonEvent) return;
  const isApproved = messageWithButtonEvent?.customId === "rowApproveID";
  const isDenied = messageWithButtonEvent?.customId === "rowDenyID";
  if (isApproved) {
    const jobID = messageWithButtonEvent?.message.embeds[0].fields.find(
      (field) => field.name === "Job ID"
    )?.value;

    const approvedJob = await prisma.jobs.findUnique({
      where: {
        id: jobID,
      },
      include: {
        user: true,
      },
    });

    const jobPostingChannel = await client.channels.fetch(
      process.env.JOB_POSTS_CHANNEL_ID ?? ""
    );
    if (jobPostingChannel instanceof TextChannel && approvedJob) {
      const approvedJobThread = await jobPostingChannel.threads.create({
        name: approvedJob.title,
        autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      });
      const isJobThreadCreated = await approvedJobThread.send({
        content: `<@${approvedJob.user.id}> Your job posting has been approved!

        **Job Title:** ${approvedJob.title}
        **Contact:** ${approvedJob.application}
        **Description:** ${approvedJob.description}
        `,
      });
      if (Boolean(isJobThreadCreated)) {
        await messageWithButtonEvent?.update({
          content: `Job Posting ${approvedJob.title} from <@${approvedJob.user.id}> Approved by <@${interaction.user.id}>`,
          embeds: [],
          components: [],
        });
        await prisma.jobs.update({
          where: {
            id: jobID,
          },
          data: {
            status: "approved",
          },
        });
      }
    }
  }

  if (isDenied) {
    const jobID = messageWithButtonEvent?.message.embeds[0].fields.find(
      (field) => field.name === "Job ID"
    )?.value;

    const deniedJob = await prisma.jobs.findUnique({
      where: {
        id: jobID,
      },
      include: {
        user: true,
      },
    });

    if (deniedJob) {
      await messageWithButtonEvent?.update({
        content: `Button: Job Posting ${deniedJob.title} from <@${deniedJob.user.id}> Denied by <@${interaction.user.id}>`,
        embeds: [],
        components: [],
      });
      await prisma.jobs.update({
        where: {
          id: jobID,
        },
        data: {
          status: "denied",
        },
      });
    }
  }
};