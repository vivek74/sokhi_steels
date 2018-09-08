var mongoose = require("mongoose");

var colSchema = mongoose.Schema({
    text: String,
    value: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Value"
      }
   ]
});

module.exports = mongoose.model("Col", colSchema);