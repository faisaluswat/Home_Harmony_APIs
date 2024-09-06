const { checkSchema } = require('express-validator');

const updateCatValidate = checkSchema({
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
    },
    desc: {
        trim: true,
        isLength: {
            options: {
                max: 100
            },
            errorMessage: "Field must be smaller then 100 cahrachters."
        }
    }
})

module.exports = updateCatValidate