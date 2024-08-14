module.exports = {
    isAdmin: (req, res, next) => {
        if (req.user.role === 1) {
            return next()
        }
        res.status(403).json({ error: "permission denied" })
    }
}