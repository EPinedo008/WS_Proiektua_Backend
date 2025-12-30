import fs from "fs/promises";
import leagueMap from "../../public/js/leagueMap.js";

const content = await fs.readFile("../../data/leagues.txt", "utf8");

const codes = content.split(/\r?\n/);

const leagues = codes.map(code => ({
  id: leagueMap[code].leagueCode,
  code: code,
  name: leagueMap[code].name,
  country: leagueMap[code].country,
  flagUrl: `/images/flags/${leagueMap[code].country.toLowerCase()}.svg`
}));

await fs.writeFile("../../public/json/leagues.json", JSON.stringify(leagues, null, 2));

console.log("league.json sortuta");
