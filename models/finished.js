//export
var mongoose = require("mongoose");
var FinishedSchema = new mongoose.Schema({
	user : {type: String},
	userid : {type: String},
	ItemNo : {type: String },
	ItemName: {type: String},
	LastUpdated: {type: Date, default: Date.now},
	itemQty: {type: Number, default: 0},
	totalCost: {type: Number},
	costPerItem: {type: Number, default: 0},
	itemDisp: {type: String}
});
module.exports = mongoose.model("Finished", FinishedSchema);