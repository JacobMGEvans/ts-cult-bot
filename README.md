# TS Cult Bot and Webapp

## Create a Discord App and Bot

1. Log into Discord and head to https://discord.com/developers/applications
2. Click `New Application`
3. Give the Bot an appropriate and agree to the terms.
4. Optionally add an image and save the bot.
5. Visit the `OAuth2` section, copy the **Client ID** and `Reset Secret` and copy that string.
6. Add `http://localhost:3000/api/auth/callback/discord` as a Redirect. You will need to add a second later  to reflect where you live deploy the Dashboard.
7. Save the OAuth2 settings.
8. Go to 'Bot' and `Add Bot`
9. Click `Reset Token` and copy the new value.
10. Go to `OAuth2` -> `URL Generator`. In the **Scopes** section select `bot` and in the Bot **Permissions** section choose `Administrator` or the specific permission you wish to allow.
11. Copy the **Generated URL** and paste that into a browser tab. Select the correct discord server and authorize the bot to join.

## Setup the apps

### Parent Dir

1. In the parent directory, run `npm i`

### TS Cult Bot

1. Change to the `/bot` directory
2. Copy the .env.sample and add in the details required.
3. Run `npm i`

### Dashboard

1. Change to the `/dashboard` directory
2. copy the .env.sample to .env and add in the details required.
3. Run `npm i`
4. Run `npm run postinstall`
5. Run `npr run migrate` (maybe required, maybe not)

## Starting the app

1. In the `/` directory, run `npm run dev`
2. Confirm that the bot is online in discord

