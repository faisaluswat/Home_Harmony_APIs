const { default: mongoose } = require("mongoose");


const bookingSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    aptDetails: {
        address: {
            street: {
                type: String,
                required: true,
                maxlength: 50
            },
            city: {
                type: String,
                required: true,
                maxlength: 30
            },
            zip: {
                type: String,
                maxlength: 15
            },
            landmark: {
                type: String,
                maxlength: 30
            }
        },
        bedrooms: {
            count: Number,
            w: Number,
            l: Number
        },
        kitchens: {
            count: Number,
            w: Number,
            l: Number
        },
        otherroom: {
            count: Number,
            w: Number,
            l: Number
        },
        livingroom: {
            exist: Boolean,
            w: Number,
            l: Number
        }
    },
    bookingInfo: {
        bookingDate: { type: Date, default: null },
        estimatedPrice: { type: Number, default: 0 },
        status: {
            type: Number,
            required: true,
            default: 1 // 1=pending 2=confirmed 3=progress 4=complete 5=canceled
        },
        advancePayment: { type: Number, default: 0 },
        wages: { type: Number, default: 0 },
        totalPayment: { type: Number, default: 0 },
        confirmBy: { type: String, default: null },
        completionDate: { type: Date, default: null }
    }
})

module.exports = mongoose.model('Book', bookingSchema);