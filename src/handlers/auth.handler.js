const jwt = require("jsonwebtoken")

module.exports = {
    login: (req, res, next) => {
        try {
            const token = jwt.sign({
                uId: req.user.id,
                issued: new Date().toJSON()
            }, process.env.JWT_SECRETE, { expiresIn: "14d" });
            const expiration = new Date();
            expiration.setDate(expiration.getDate() + 14);
            res.json({ uId: req.user.id, token, expiration: expiration.getTime() })
        } catch (e) {
            next(e)
        }
    }
}