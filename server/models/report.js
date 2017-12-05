var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var reportSchema = new Schema({
    offender: String,
    type: String,
    desc: String,
    reporter: String,
    date: {type: String, default: ""}
});

module.exports = mongoose.model('Report', reportSchema)