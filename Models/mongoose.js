const mongoose = require('mongoose');

var Schema = mongoose.Schema;


var PhoneNumberSchema = new Schema({
    itemId: Number,
    name: String,
    phone: String,
    isActive: Boolean
}, {collection:"PhoneNumberList"});

module.exports.PhoneNumber = mongoose.model('PhoneNumber', PhoneNumberSchema);