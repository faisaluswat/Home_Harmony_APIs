const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
    street: {
        type: String,
        required: true,
        maxlength: 200
    },
    city: {
        type: String,
        required: true,
        maxlength: 50
    },
    state: {
        type: String,
        required: true,
        maxlength: 50
    },
    country: {
        type: String,
        required: true,
        maxlength: 50
    },
    zipcode: {
        type: String,
        required: true,
        maxlength: 30
    }
})

const orderSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    email: {
        type: String,
        lowercase: true,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: addressSchema,
        required: true
    },
    sAddress: {
        type: addressSchema
    },
    productDetails: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        qty: {
            type: Number,
            required: true
        },
        color: String,
        price: {
            type: Number,
            required: true
        }
    }],
    paymentId: {
        type: String,
        unique: true,
        required: true,
        default: null,
        sparse: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
    },
    subtotal: {
        type: Number,
        required: true
    },
    discount: {
        type: Number,
        default: 0
    },
    shipping: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: 'String',
        required: true,
        default: "processing"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema);