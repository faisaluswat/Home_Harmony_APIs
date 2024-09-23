const mongoose = require("mongoose");

const detailSchema = new mongoose.Schema({
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
    }
})

const orderSchema = new mongoose.Schema({
    billdetails: {
        type: detailSchema,
        required: true
    },
    shippdetails: {
        type: detailSchema
    },
    productDetails: [{
        pId: {
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
    payId: {
        type: String,
        required: function () {
            return this.payId !== null
        },
        unique: true,
        sparse: true,
        default: null
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
    tax: {
        type: Number,
        default: 0
    },
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: Number,
        required: true,
        default: 1 // 1=active 2=pending 3=deliverd/complete 4=canceled
    },
    paymethod: {
        type: 'String',
        required: true,
        default: 'cod'
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Order', orderSchema);