var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    activated: Boolean,
    token: String
});

module.exports = mongoose.model('User', userSchema)