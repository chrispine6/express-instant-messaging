// auth.middleware.js
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user.model');

passport.use(new LocalStrategy(async (username, password, done) => {
    try {
        console.log('Authenticating user:', username);
        
        const user = await User.findOne({ username });
        if (!user) {
            console.log('Incorrect username:', username);
            return done(null, false, { message: 'Incorrect username.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            console.log('Incorrect password for username:', username);
            return done(null, false, { message: 'Incorrect password.' });
        }

        console.log('Authentication successful for username:', username);
        return done(null, user);
    } catch (error) {
        console.error('Error during authentication:', error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});

module.exports = passport;
