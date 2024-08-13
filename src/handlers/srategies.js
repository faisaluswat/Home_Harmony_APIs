const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const jwtStrategy = passportJWT.Strategy;
const extractJwt = passportJWT.ExtractJwt;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user.model');

// Local Strategy
passport.use(new localStrategy({ usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        User.findOne({ email }).then(user => {
            if (!user) {
                return done(null, false, { message: 'Email is not registered.' });
            }
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err) return done(null, false);
                if (!isMatch) return done(null, false, { message: 'Incorrect Password.' });
                done(null, user);
            })
        }).catch(e => {
            return done(e);
        })
    }
))

// jwt strategy
passport.use(new jwtStrategy({
    jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRETE,
    passReqToCallback: true
}, (req, tokenPayload, done) => {
    const token = extractJwt.fromAuthHeaderAsBearerToken()(req);
    jwt.verify(token, process.env.JWT_SECRETE, async (err, decode) => {
        if (err) return done(null, false, { message: 'Invalid token or expired.' });
        const isExist = await User.findById(decode.uId);
        if (!isExist) return done(null, false, { message: 'User not exist.' });
        const user = { uId: decode.uId, role: isExist.role }
        user ? done(null, user) : done(null, false)
    })
}))