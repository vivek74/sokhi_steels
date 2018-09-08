var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");


var UserSchema = new mongoose.Schema({
    employee: {type: String},
    employeeid: {type: String},
    username: {type: String, unique: true, required:true},
    password: String,
    passwordCopy: String,
    firstName: String,
    lastName: String,
    phone: Number,
    address: {type: String},
    city: {type: String},
    state: {type: String},
    zip: {type: Number},
    employeeType: {type: String},
    createdAt: { type: Date, default: Date.now},
    isAdmin: {type: Boolean, default: false},
    isInventry: {type: Boolean, default: false},
    isProduction: {type: Boolean, default: false},
    isSails: {type: Boolean, default: false},
    isScheduler: {type: Boolean, default: false},
    email: {type: String},
    age: {type: Number},
    salary: {type: Number},
    messages: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Message"
      }
   ],
   tasks: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Task"
      }
   ]
});

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", UserSchema);