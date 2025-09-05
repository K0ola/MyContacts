const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        required: true,
        unique: true,
    },
    password: {
        required: true,
    },
    createdAt: {
        default: Date.now,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;