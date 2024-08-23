const { checkSchema } = require('express-validator');
const Product = require('../../models/product.model');
const { default: mongoose } = require('mongoose');

const updateProdValid = checkSchema({
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
            options: async (value, { req }) => {
                const pId = req.params.pId;
                let isProduct = await Product.findOne({ sku: value, _id: { $ne: pId } });
                if (isProduct) {
                    throw new Error('Another product exists with the same SKU.');
                }
            }

        }
    },
    rprice: {
        notEmpty: {
            bail: true,
            errorMessage: 'Empty field.'
        },
        isNumeric: {
            bail: true,
            errorMessage: 'Invalid Format'
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

module.exports = updateProdValid;