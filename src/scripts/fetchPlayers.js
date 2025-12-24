const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writePath = path.join(__dirname, '../../public/images/players/');
const playersJsonPath = path.join(__dirname, '../../public/json/fullplayers25.json');

async function main() {
  await fs.mkdir(writePath, { recursive: true });

  const jsona = await fs.readFile(playersJsonPath, 'utf8');
  const jokalariak = JSON.parse(jsona);

  const ids = jokalariak
    .map(p => p.id)
    .filter(id => typeof id === 'number');

  let index = 0;

  // Throttling: 10 eskaera segunduko
  const interval = setInterval(async () => {
    if (index >= ids.length) {
      clearInterval(interval);
      console.log('Deskarga amaituta');
      return;
    }

    const id = ids[index++];
    const folder = id % 32;
    const url = `https://playfootball.games/media/players/${folder}/${id}.png`;

    try {
      const res = await fetch(url);

      if (res.status === 200) {
        const filePath = path.join(writePath, `${id}.png`);
        res.body.pipe(fsSync.createWriteStream(filePath));
        console.log(`Deskargatuta ${id}`);
      } else if (res.status === 429) {
        console.log('Too Many Requests (429)');
      } else {
        console.log(`${id} → ${res.status}`);
      }
    } catch (err) {
      console.error(`Errorea ID: ${id}`, err);
    }
  }, 100); // 100 ms = 10 req/seg
}

main();
