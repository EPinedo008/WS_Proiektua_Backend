const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writePath = path.join(__dirname, '../../public/images/leagues/');

(async () => {
  try {
    await fs.mkdir(writePath, { recursive: true });

    const content = await fs.readFile(
      path.join(__dirname, '../../data/leagues.txt'),
      'utf8'
    );

    const data = content.split(/\r?\n/);

    data.forEach((leagueId, idx) => {
      const url = `https://playfootball.games/media/competitions/${leagueId}.png`;

      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(
              fsSync.createWriteStream(`${writePath}/${leagueId}.png`)
            );
          } else {
            console.log(`${leagueId} ez aurkitua (${res.status})`);
          }
        })
        .catch(err => console.error(err));
    });
  } catch (err) {
    console.error(err);
  }
})();
