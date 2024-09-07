const { checkSchema } = require('express-validator');
const Product = require('../../models/product.model');

const settingValid = checkSchema({
    address: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                max: 100
            },
            errorMessage: "Field can't exceed 100 characters"
        }
    },
    contact: {
        optional: true,
        isMobilePhone: {
            bail: true,
            errorMessage: "contact is not a valid format!",
        },
    },
    tax: {
        optional: true,
        isNumeric: true
    },
    shipping: {
        optional: true,
        isNumeric: true
    },
    discount: {
        optional: true,
        isNumeric: true
    },
    stripe: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                max: 6
            },
            errorMessage: "Field can't exceed 6 characters"
        }
    },
    paypal: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                max: 6
            },
            errorMessage: "Field can't exceed 6 characters"
        }
    },
    cod: {
        optional: true,
        trim: true,
        isLength: {
            options: {
                max: 6
            },
            errorMessage: "Field can't exceed 3 characters"
        }
    }
})

module.exports = settingValid;