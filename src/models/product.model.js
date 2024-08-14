const mongoose = require('mongoose');

const productShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20
    },
    desc: {
        type: String,
        trim: true,
        maxlength: 100
    },
    featured: {
        type: String,
        required: true,
        default: '/placeholders/product.jpg'
    },
    gallery:[{
        type: String,
    }],
    colors:[{
        type: String,
    }],
    sku: {
        type: String,
        trim: true
    },
    cat:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cat',
        default: null
    },
    rprice:{
        type: Number,
        required: true,
        default: 0
    },
    sprice:{
        type: Number,
    },
    type: {
        type: String,
        default: 'fixed'
    },
    status: {
        type: String,
        default: true
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Product', productShema);