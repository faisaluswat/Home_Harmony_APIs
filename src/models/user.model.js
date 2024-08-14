const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100
    },
    phone: {
        type: String,
        trim: true,
        unique: true,
        sparse: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Your Email is not Correct");
            }
        },
    },
    password: {
        type: String,
        minlength: [6, "password should be greater than 6"],
        trim: true,
    },
    avatar: {
        type: String,
        default: '/placeholders/avatar.png'
    },
    role: {
        type: Number,
        required: true,
        default: 3
    }
}, {
    timestamps: true
})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})


module.exports = mongoose.model('User', userSchema);