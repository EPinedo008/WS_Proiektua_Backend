const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writePath = path.join(__dirname, '../../public/images/teams/');

(async () => {
  try {
    await fs.mkdir(writePath, { recursive: true });

    const content = await fs.readFile(
      path.join(__dirname, '../../data/teamIDs.txt'),
      'utf16le'
    );

    const teamIds = content.split(/\r?\n/);

    teamIds.forEach(id => {
      const folder = id % 32;
      const url = `https://cdn.sportmonks.com/images/soccer/teams/${folder}/${id}.png`;

      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(
              fsSync.createWriteStream(`${writePath}/${id}.png`)
            );
          }
        });
    });
  } catch (err) {
    console.error(err);
  }
})();
