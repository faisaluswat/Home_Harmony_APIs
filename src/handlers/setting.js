const Setting = require("../models/setting.model")
const { prodErrors } = require("../utils/prodsError")

module.exports = {
    settings: async (req, res, next) => {
        try {
            const validationErrors = await prodErrors(req)
            if (validationErrors) {
                return res.status(422).send(validationErrors)
            }
            const { address, contact, tax, shipping, discount } = req.body;
            let settingData = { address, contact, tax, shipping, discount };
            if (req.body.payment instanceof Array) {
                settingData.payment = {
                    stripe: false,
                    paypal: false,
                    cod: false
                };

                req.body.payment.forEach(method => {
                    if (method === 'stripe') settingData.payment.stripe = true;
                    if (method === 'paypal') settingData.payment.paypal = true;
                    if (method === 'cod') settingData.payment.cod = true;
                });
            } else if (typeof req.body.payment === 'string'){                
            } else {
                settingData.payment = req.body.payment
            }
            const setting = await Setting.findOne({}, 'address contact tax shipping discount payment');
            if (setting) {
                Object.assign(setting, settingData);
                await setting.save();
                return res.send({ message: 'Setting saved.' })
            }
            await new Setting(settingData).save();
            res.status(201).send({ message: 'Setting saved.' });

        } catch (e) {
            next(e)
        }
    },
    settingsInfo: async (req, res, next) => {
        try {
            const setting = await Setting.findOne({}, 'address contact tax shipping discount payment');
            if (!setting) {
                return res.status(404).send({ error: 'setting not found.' })
            }
            res.send({ setting })
        } catch (e) {
            next(e)
        }
    }
}