const express = require('express');
const path = require('path');
const app = express();


app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));


app.use(express.static(path.join(__dirname, '../public')));


app.get('/', (req, res) => {
    res.render('home', {
        gameNumber: 101, 
        playerImage: 'https://media.api-sports.io/football/players/154.png', // Messi (ejemplo)
        previousGameId: 'PREV123'
    });
});

module.exports = app;