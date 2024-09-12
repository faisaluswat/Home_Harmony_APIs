module.exports = {
    getPublicKey: async (req, res, next) => {
        try {
            const publish_key = process.env.STRIPE_PUBLISH_KEY;
            if (!publish_key) {
                return res.status(404).send({ error: 'Key not found.' })
            }
            res.send({ publish_key });
        } catch (e) {
            next(e);
        }
    }
}