var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var dmcaSchema = new Schema({
    dmca: String,
    takedown: String
});

module.exports = mongoose.model('DMCA', dmcaSchema)