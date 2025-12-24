const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const writePath = path.join(__dirname, '../../public/images/nations/');

(async () => {
  try {
    await fs.mkdir(writePath, { recursive: true });

    const content = await fs.readFile(
      path.join(__dirname, '../../data/nationalities.txt'),
      'utf16le'
    );

    const nations = content.split(/\r?\n/);

    nations.forEach(country => {
      const encoded = encodeURIComponent(country);
      const url = `https://playfootball.games/media/nations/${encoded}.svg`;

      fetch(url)
        .then(res => {
          if (res.status === 200) {
            res.body.pipe(
              fsSync.createWriteStream(`${writePath}/${encoded}.svg`)
            );
          }
        });
    });
  } catch (err) {
    console.error(err);
  }
})();
