// auth.routes.js
const express = require('express');
const router = express.Router();
const passport = require('../middleware/auth.middleware');
const User = require('../models/user.model'); // Add this line

router.get('/', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const newUser = new User({ username, password });
        await newUser.save();
        res.redirect('/login');
    } catch (error) {
        console.error('Error handling user registration:', error);
        res.status(500).send('Error handling user registration');
    }
});

router.get('/login', (req, res) => {
    res.render('login');
})

router.post('/login', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/login',
    failureFlash: true
}));

module.exports = router;
