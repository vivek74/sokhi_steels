//inventory row material
var mongoose = require("mongoose");
var productionRowSchema = new mongoose.Schema({
	user : {type: String},
	userid : {type: String},
    machineName: {type: String},
    startTime:   {type: Date, default: Date.now},
    itemNo:      {type: String},
    itemName:    {type: String},
    itemQuant:   {type: Number, default: 0},
    endTime:     {type: Date, date: Date.now},
    date:        {type: Date, date: Date.now}
});
module.exports = mongoose.model("productionRow", productionRowSchema);