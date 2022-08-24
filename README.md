<h1 align="center">
    🤖 Know It All 🤖
</h1>

<h3 align="center">
  A Discord bot that sends a trivia question at a random time each day.
</h3>

## How it works
Once per day, the bot sends a random question from <a href="https://opentdb.com/">Open Trivia Database</a> to the first text channel in the server, at a random time between 5PM and 11PM AEST.

Users get one attempt at answering the question; if they answer correctly, a point is added to their streak and they are granted the `Trivia Kingpin` role. If they answer incorrectly, their streak is reset and the role is removed (if they previously held the title).

## Getting up and running
- Make sure you have [Node](https://nodejs.dev) and [Docker](https://www.docker.com/get-started) installed
- Create an application through the Discord developer portal and get yourself a token
  - Add this application (the bot) to your server. You need to make sure it has the following permissions `View Channels`, `Send Messages`, `Embed Links` and `Read Message History`
- Run `docker-compose up`
  - This will spin up `postgres` and `pgAdmin` containers
  - `postgres` is the database
  - `pgAdmin` is a GUI for querying the database (when adding a server, the container name is the host!)
- Create an `.env` file based off `.env.example` and fill out the values
- Install the depenencies with your package manager of choice
- Run the `start` script!

## The stack
- Node.js
- Discord.js
- Postgres
