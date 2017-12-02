var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
    id: String,
    links: []
});

module.exports = mongoose.model('Photo', photoSchema)