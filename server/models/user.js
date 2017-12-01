var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: String,
    password: String,
    activated: Boolean
});

module.exports = mongoose.model('User', userSchema)