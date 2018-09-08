//product sheet
var mongoose = require("mongoose");
var productSheetSchema = new mongoose.Schema({
    itemNo: {type: String, unique: true},
    itemName: {type: String},
    updatedOn: { type: Date, default: Date.now},
    desc: {type:String},
    costPerItem: {type: Number, default: 0},
    user: {type: String}
});
module.exports = mongoose.model("productSheet", productSheetSchema);