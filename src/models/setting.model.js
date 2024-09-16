const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    address: {
        type: String,
        trim: true,
        maxlength: 100,
    },
    contact: {
        type: String,
        trim: true,
        maxlength: 60
    },
    tax: {
        type: Number,
        required: true,
        default: 0
    },
    shipping: {
        type: Number,
        required: true,
        default: 0
    },
    discount: {
        type: Number,
        required: true,
        default: 0
    },
    payment: {
        stripe: {
            type: Boolean,
            default: false
        },
        paypal: {
            type: Boolean,
            default: false
        },
        cod: {
            type: Boolean,
            default: false
        }
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Setting', settingSchema);