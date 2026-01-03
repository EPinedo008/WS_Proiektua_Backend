const jwt = require('jsonwebtoken');
const User = require('../modules/users/users.model');

exports.protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ msg: 'Ez dago baimenduta (Token falta da).' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token baliogabea.' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ msg: 'Sarbide debekatua. Admin rola behar da.' });
  }
};

exports.checkUser = async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    }

    
    if (!token) {
        req.user = null; 
        return next();
    }

    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        req.user = await User.findById(decoded.userId).select('-password');
        next();
    } catch (error) {
        
        req.user = null;
        next();
    }
};