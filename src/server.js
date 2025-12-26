const express = require('express');
const path = require('path');
const connectDB = require("./src/database/database");
const app = express();
const PORT = 3000;

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/json', express.static(path.join(__dirname, '../public/json')));

app.use(express.static(path.join(__dirname, '../public')));

connectDB();
app.listen(PORT, () => {
  console.log(`Zerbitzaria: http://localhost:${PORT}`);
});
