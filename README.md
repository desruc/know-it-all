<h1 align="center">
   🏰 Knowledge Knight 🏰
</h1>

<h3 align="center">
  A Discord bot that sends a trivia question at a random time each day.
</h3>

## What it does
Once per day, the bot sends a random question from <a href="https://opentdb.com/">Open Trivia Database</a> to the first text channel in the server, at a random time between 10AM and 11PM AEST.

Users get one attempt at answering the question; if they answer correctly, they are given some points and their streak is incremented by one. If they answer incorrectly, their points and streak is reset.

The first user to answer correctly gets 3 points, the second gets 2 points and the third gets 1 point. After three people have answered correctly (or half an hour passes), the question is closed.

![Screenshot 2022-08-24 225121](https://user-images.githubusercontent.com/36631337/186424381-027eb675-1195-4fad-8f73-fbc6d6d8da24.png)

(Don't mind the name of my bot 😅)

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
