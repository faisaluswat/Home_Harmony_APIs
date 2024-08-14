const { checkSchema } = require('express-validator');
const Product = require('../../models/product.model');

const prodValid = checkSchema({
    name: {
        trim: true,
        notEmpty: {
            errorMessage: 'Empty field'
        },
        isLength: {
            options: {
                max: 20
            },
            errorMessage: "Field must be less then 20 characters"
        }
    },
    desc: {
        trim: true,
        isLength: {
            options: {
                max: 100
            },
            errorMessage: "Field exceed from 100 characters"
        }
    },
    sku: {
        optional: true,
        custom: {
            options: async value => {
                let isProduct = await Product.findOne({ sku: value });
                if (isProduct) {
                    throw new Error('Another product exist with same sku.')
                }
            }
        }
    },
    rprice: {
        isNumeric: {
            bail: true,
            errorMessage: 'Invalid Format'
        },
        notEmpty: {
            errorMessage: 'Empty field.'
        }
    },
    sprice: {
        optional: true,
        isNumeric: true
    },
    type: {
        optional: true,
        isString: true
    }

})

module.exports = prodValid;