const express = require('express');
const path = require('path');
const connectDB = require("./database/database");
const app = express();
app.use(express.json());
const PORT = 3000;

const userRoutes = require('./modules/users/users.routes');
app.use('/api/users', userRoutes);

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/json', express.static(path.join(__dirname, '../public/json')));

app.use(express.static(path.join(__dirname, '../public')));

connectDB();
app.listen(PORT, () => {
  console.log(`Zerbitzaria: http://localhost:${PORT}`);
});
