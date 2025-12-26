const connectDB = require("../database/database");
const Player = require("../modules/players/players.model");
const Team = require("../modules/players/team.model");
const League = require("../modules/players/league.model");
const fs = require("fs/promises");
const path = require("path");

async function seed() {
  await connectDB();

  const players = JSON.parse(
    await fs.readFile(path.join(__dirname, "../../public/json/fullplayers25.json"))
  );

  const teams = JSON.parse(
    await fs.readFile(path.join(__dirname, "../../public/json/teams.json"))
  );

  const leagues = JSON.parse(
    await fs.readFile(path.join(__dirname, "../../public/json/leagues.json"))
  );

  await Player.deleteMany();
  await Team.deleteMany();
  await League.deleteMany();

  await Player.insertMany(players);
  await Team.insertMany(teams);
  await League.insertMany(leagues);

  console.log("Seed eginda!");
  process.exit();
}

seed();
