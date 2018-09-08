var mongoose = require("mongoose");

var taskSchema = mongoose.Schema({
    text: String,
    qtyAssinged: {type: Number, default: 0},
    qtyDone: {type: Number, default: 0},
    createdAt: { type: Date, default: Date.now },
    isHalf: {type: Boolean, default: false},
    isDone: {type: Boolean, default: false},
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Task", taskSchema);