const User = require('./users.model'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  const { name, lastName, email, password } = req.body;

  try {

    if (!name || !lastName || !email || !password) {
      return res.render('auth/register', { 
        error: 'Eremu guztiak beharrezkoak dira.',
        formData: req.body 
      });
    }


    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(password)) {
      return res.render('auth/register', { 
        error: 'Pasahitzak gutxienez letra larri bat, xehe bat eta zenbaki bat behar ditu.',
        formData: req.body
      });
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.render('auth/register', { 
        error: 'Email hori jada erregistratuta dago.',
        formData: req.body
      });
    }

    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ name, lastName, email, password: hashedPassword, role });

    res.redirect('/api/users/login');

  } catch (error) {
    console.error(error);
    res.render('auth/register', { 
        error: 'Zerbitzariaren errorea. Saiatu berriro.',
        formData: req.body
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send('Ez da bilatu erabiltzailerik email horrekin.');
    }

   
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Pasahitz okerra.');
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    
    res.cookie('token', token, {
        httpOnly: true, 
        maxAge: 24 * 60 * 60 * 1000 // egun 1
    });

    
    res.redirect('/'); 

  } catch (error) {
    console.error(error);
    res.status(500).send('Zerbitzariaren errorea loginean');
  }
};



exports.logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/api/users/login');
};