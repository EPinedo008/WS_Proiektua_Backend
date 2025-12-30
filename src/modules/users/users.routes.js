const express = require('express');
const router = express.Router();


const userController = require('./users.controller');


const { protect, adminOnly } = require('../../middleware/auth.middleware');




router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', userController.logout);


router.get('/profile', protect, (req, res) => {
    res.json(req.user);
});


router.get('/admin-dashboard', protect, adminOnly, (req, res) => {
    res.json({ msg: "Admin gunea" });
});

module.exports = router;