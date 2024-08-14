const mongoose = require('mongoose');

const catShema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 20,
        unique: true
    },
    desc: {
        type: String,
        trim: true,
        maxlength: 100
    },
    icon: {
        type: String,
    }
},{
    timestamps: true
})

module.exports = mongoose.model('Cat', catShema);