const prodErrors = require('../utils/prodsError')


module.exports = {
    addProd: async (req, res) => {
        try {
            const validationErrors = await prodErrors(req)
            if (validationErrors) {
                return res.status(422).send(validationErrors)
            }
            console.log(req.body)
        } catch (e) {
            throw new Error(e);
        }
    }
}