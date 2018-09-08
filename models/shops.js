var mongoose = require("mongoose");

var shopsSchema = mongoose.Schema({
    shopName: String,
    name: String,
    createdAt: { type: Date, default: Date.now },
    cols: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Col"
      }
   ]
});

module.exports = mongoose.model("ShopsModel", shopsSchema);