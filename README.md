# Upwork RSS Job Notifier

Currently frontend does nothing, but I do plan to add a dashboard in future, where user will be able to control notifier settings from the dashboard.

### How to get started

1.  Clone the repo (duh-doiii):
    `git clone https://github.com/rismailov/rss.git`
    <br>
2.  Go to `/api` directory and install deps:
    `cd api && npm install`
    <br>
3.  Create your own copy of `.env` file:
    `cp .env.example .env`
    <br>
4.  Update ENV variables to reflect the hard facts of reality:
    4.1 `DATABASE_URL`:
    Create a PostgreSQL database and update the connection string.

      <br >

    4.2 `TELEGRAM_TOKEN`:

    1. Open Telegram and search for the "BotFather" bot.
    2. Start a chat with the BotFather by clicking on the "Start" button.
    3. Type `/newbot` and follow the instructions to create a new bot.
    4. Choose a name for your bot and a username that ends with "bot".
    5. BotFather will provide you with a unique Token for your bot.
    6. Save the Token in a safe place, as you will need it to communicate with your bot.

    <br>

    4.3 `TELEGRAM_CHAT_ID`:

    1. Start a chat with your bot.
    2. Send any message to your bot.
    3. Open the following URL in your browser, replacing YOUR_BOT_TOKEN with the actual token for your bot:

    ```bash
    https://api.telegram.org/botYOUR_BOT_TOKEN/getUpdates
    ```

    4. Look for the `"chat":{"id":` value in the response. This is your chat ID.

    <br>

    4.4 `RSS_URL` (Upwork RSS URL):

    1. Log in to your Upwork account.
    2. Click on the "Find Work" tab in the top navigation menu.
    3. Select the category you're interested in, and then select the subcategory.
    4. Click on the "RSS" icon on the right side of the page.
    5. Copy the URL in your browser's address bar. This is the RSS feed URL for that category/subcategory.

<br>

5. Run the script:
   `npm run parse`
   <br>

    This will start a node process that won't exit unless you terminate it manually with `Ctrl-C`.
    <br>

    Currently interval is set to 10 seconds: e.g. cron job will be executed every 10 seconds. I'll add an option to modify that later on, but for now you can edit the `./api/src/scripts/parse-upwork-rss.ts` script and set any interval you want.
