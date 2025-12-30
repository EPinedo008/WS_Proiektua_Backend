const User = require('./users.model'); 

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.register = async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

    
    if (!name || !lastName || !email || !password) {
      return res.status(400).json({ msg: 'Eremu guztiak beharrezkoak dira.' });
    }

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: 'Email hori jada erregistratuta dago.' });
    }

    
    const isFirstAccount = (await User.countDocuments({})) === 0;
    const role = isFirstAccount ? 'admin' : 'user';

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({
      msg: 'Erabiltzailea sortua',
      user: {
        id: newUser._id,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Zerbitzariaren errorea erregistroan' });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Ez da bilatu erabiltzailerik email horrekin' });
    }

    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Pasahitz okerra' });
    }

    
    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET, 
      { expiresIn: '1d' }
    );

    res.json({
      msg: 'Saioa hasita',
      token,
      user: { role: user.role }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: 'Zerbitzariaren errorea loginean' });
  }
};


exports.logout = (req, res) => {
  res.json({ msg: 'Saioa itxita. Ezabatu tokena bezeroan.' });
};