var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var collectionSchema = new Schema({
    owner: String,
    name: String,
    totalrate: {type: Number, default: 0},
    nrates: {type: Number, default: 0},
    access: {type: String, default: "public"},
    desc: {type: String, default: ""},
    images: [],
    ratings: []
});

module.exports = mongoose.model('Collection', collectionSchema)