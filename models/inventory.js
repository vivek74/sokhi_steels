//inventory row material
var mongoose = require("mongoose");
var InventorySchema = new mongoose.Schema({
    user : {type: String},
    userid : {type: String},
    itemNo: {type: String},
    itemName: {type: String},
    updatedOn: { type: Date, default: Date.now},
    itemQty: {type: Number, default: 0},
    remark: {type:String},
    totalCost: {type: Number},
    costPerItem: {type: Number, default: 0},
    reorder: {type: String, default: "ok"},
    reorder2: {type: String, default: "reorder"},
    vendor: {type: String},
    vendorAdd: {type: String}
});
module.exports = mongoose.model("Inventory", InventorySchema);