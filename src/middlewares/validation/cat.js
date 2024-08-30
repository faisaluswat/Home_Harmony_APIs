const { checkSchema } = require('express-validator');
const Cat = require('../../models/cat.model');

const catValidate = checkSchema({
    name: {
        trim: true,
        notEmpty: {
            errorMessage: "Field is Empty"
        },
        isLength: {
            options: {
                max: 20,
            },
            errorMessage: "Field must be smaller then 20 cahrachters"
        },
        toLowerCase: true,
        custom: {
            options: async value => {
                let isUser = await Cat.findOne({ name: value });
                if (isUser) {
                    throw new Error('Category is already exist with same name.')
                }
            }
        },
    },
    desc: {
        trim: true,
        isLength: {
            options: {
                max: 100
            },
            errorMessage: "Field must be smaller then 100 characters."
        }
    }
})

module.exports = catValidate