var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var productionRow = require('../models/productionModel');
var middleware = require("../middleware");

router.get("/work-page/production", function(req, res, next){
    productionRow.find({}, function(err , allitems){
        if(err){
                console.log(err);
            } else {
                //redirect back to category page
                res.render("production",{allitems: allitems});
            }
      });
});

router.post("/work-page/production", function(req, res, next){
	//console.log(req.body);
    var machineName = req.body.machine;
    var itemName = req.body.itemName;
    var itemNo = req.body.itemNo;
    var startTime = Date.now();
    var date =Date.now();
    
    var data = {machineName, startTime, itemNo, itemName, date};
    //console.log(data)
  	productionRow.create(data, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to category page
            req.flash("success","Successfully created");
            res.redirect("/work-page/production");
        }
    });
});
//Add Quantity
router.put("/work-page/production/:id", function(req, res,next){
    var itemQuant = req.body.quantity;
    var endTime = Date.now();
    var newData= {itemQuant, endTime};
    productionRow.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foundUser){
      if(err){
              req.flash("error", err.message);
          } else {
              res.redirect('/work-page/production');
          }
    })
  });

module.exports = router;