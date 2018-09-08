//export
var mongoose = require("mongoose");
var ExportSchema = new mongoose.Schema({
	user : {type: String},
	userid : {type: String},
	ItemNo : {type: String},
	ItemName: {type: String},
	SellDate: {type: Date, default: Date.now},
	itemQty: {type: Number, default: 0},
	totalCost: {type: Number},
	costPerItem: {type: Number, default: 0},
	CustomerName: {type: String},
	CustomerContact: {type: String},
	CustomerAddress: {type: String}
});
module.exports = mongoose.model("Export", ExportSchema);