const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    details: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        hobby: { type: String, required: true },
    },
});
module.exports = mongoose.model('User', userSchema);
