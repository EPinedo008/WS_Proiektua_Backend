require('dotenv').config();

const { checkUser } = require('./middleware/auth.middleware');
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const userRoutes = require('./modules/users/users.routes');
const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
const connectDB = require("./database/database");


const PORT = 3000;


app.use('/api/users', userRoutes);

app.use('/images', express.static(path.join(__dirname, '../public/images')));
app.use('/json', express.static(path.join(__dirname, '../public/json')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', checkUser, (req, res) => {
    
    res.render('home', { 
        user: req.user 
    });

});

app.use(express.static(path.join(__dirname, '../public')));



connectDB();
app.listen(PORT, () => {
  console.log(`Zerbitzaria: http://localhost:${PORT}`);
});
