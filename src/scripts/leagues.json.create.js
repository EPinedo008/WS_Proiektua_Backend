import fs from "fs/promises";

const players = JSON.parse(
  await fs.readFile("../../public/json/fullplayers25.json", "utf8")
);

const leagueMap = JSON.parse(
  await fs.readFile("../../public/json/leagueMap.json", "utf8") //sortu eskuz
);

const leagueIds = [...new Set(players.map(p => p.leagueId))];

const leagues = leagueIds.map(id => ({
  id,
  name: leagueMap[id].name,
  code: leagueMap[id].code,
  country: leagueMap[id].country,
  flagUrl: `https://playfootball.games/media/nations/${leagueMap[id].country.toLowerCase()}.svg` //aldatu deskargatuta daudelako public en
}));

await fs.writeFile(
  "league.json",
  JSON.stringify(leagues, null, 2)
);

console.log(" league.json sortuta");

