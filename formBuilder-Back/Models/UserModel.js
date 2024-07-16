const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address.']
    },
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: [3, 'Username must be at least 3 characters long.']
    },
    password: {
        type: String,
        required: true,
        minlength: [6, 'Password must be at least 6 characters long.']
    }, 
    role: {
        type: String,
        enum: ['user','admin'],
        default: 'user'
    }
});


const UserModel = mongoose.model('User', userSchema);


module.exports = UserModel;
