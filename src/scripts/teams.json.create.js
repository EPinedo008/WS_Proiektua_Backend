const fs = require("fs");

const players = JSON.parse(fs.readFileSync("../../public/json/fullplayers25.json"));
const leagues = JSON.parse(fs.readFileSync("../../public/json/leagues.json"));

const leagueMap = new Map();
leagues.forEach(l => leagueMap.set(l.id, l));
const teamsMap = new Map();

players.forEach(p => {
  if (!teamsMap.has(p.teamId)) {
    const league = leagueMap.get(p.leagueId);
    teamsMap.set(p.teamId, {
      id: p.teamId,
      name: `Team ${p.teamId}`,
      leagueId: p.leagueId,
      logoUrl: `/images/teams/${p.teamId}.png`,
      country:  league.country,
      stadium: "Unknown"
    });
  }
});

fs.writeFileSync( "../../public/json/teams.json",JSON.stringify([...teamsMap.values()], null, 2));
