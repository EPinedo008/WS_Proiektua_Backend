const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function fetchElkartua(type) {
  const config = {
    leagues: {
      inputFile: '../../data/leagues.txt',
      outputDir: '../../public/images/leagues',
      buildUrl: id =>
        `https://playfootball.games/media/competitions/${id}.png`,
      filename: id => `${id}.png`
    },

    flags: {
      inputFile: '../../data/nationalities.txt',
      outputDir: '../../public/images/nations',
      buildUrl: country =>
        `https://playfootball.games/media/nations/${encodeURIComponent(country)}.svg`,
      filename: country =>
        `${encodeURIComponent(country)}.svg`
    },

    teams: {
      inputFile: '../../data/teamIDs.txt',
      outputDir: '../../public/images/teams',
      buildUrl: id => {
        const folder = id % 32;
        return `https://cdn.sportmonks.com/images/soccer/teams/${folder}/${id}.png`;
      },
      filename: id => `${id}.png`
    }
  };

  const cfg = config[type];

  if (!cfg) {
    console.error(' Erabili: leagues | flags | teams');
    return;
  }

  try {
    const writePath = path.join(__dirname, cfg.outputDir);
    await fs.mkdir(writePath, { recursive: true });

    const encoding = type === 'leagues' ? 'utf8' : 'utf16le';
    const content = await fs.readFile(
      path.join(__dirname, cfg.inputFile),
      encoding
    );

    const items = content.split(/\r?\n/);

    items.forEach(item => {
      const url = cfg.buildUrl(item);

      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(
              fsSync.createWriteStream(
                path.join(writePath, cfg.filename(item))
              )
            );
          } else {
            console.log(`${item} ez aurkitua (${res.status})`);
          }
        })
        .catch(err => console.error(err));
    });
  } catch (err) {
    console.error(err);
  }
}


const type = process.argv[2];
fetchElkartua(type);
