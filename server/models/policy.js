var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var policySchema = new Schema({
    security: String,
    privacy: String
});

module.exports = mongoose.model('Policy', policySchema)