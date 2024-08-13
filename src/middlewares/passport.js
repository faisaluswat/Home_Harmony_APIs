const passport = require("passport");

require('../handlers/srategies');

module.exports = {
    mailAuth: (req, res, next) => {
        passport.authenticate('local', { session: false, keepSessionInfo: false },
            (err, user, info) => {
                if (err) return res.status(500).send({ error: 'Internal Server Error.' });
                if (!user) return res.status(400).send({ error: info.message });
                req.login(user, { session: false }, (loginErr) => {
                    if (loginErr) return res.status(500).send({ error: 'Internal Server Error during login.' })
                    next();
                })
            }
        )(req, res, next)
    },
    tokenAuth: passport.authenticate('jwt', { session: false, keepSessionInfo: false })
}