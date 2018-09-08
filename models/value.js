var mongoose = require("mongoose");

var valueSchema = mongoose.Schema({
    text: String
});

module.exports = mongoose.model("Value", valueSchema);