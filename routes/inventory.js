var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var Inventory = require("../models/inventory");
var Finished = require("../models/finished");

router.get("/work-page/rawMaterial", function(req, res, next){
	Inventory.find({}, function(err, allitems){
		if(err){
			console.log(err);
		} else {
			res.render("rawMaterial",{allitems: allitems});
		}
	});
});

//finished product
router.get("/work-page/finished-product", function(req, res, next){
	Finished.find({}, function(err, allitems){
		if(err){
			console.log(err);
		} else {
			res.render("finished",{allitems: allitems});
		}
	});
});

//post request of finished product

router.post("/work-page/finished-product", function(req, res, next){
  var user = req.user.username;
  var userid = req.user.id;
  var itemNo = req.body.itemNo;
  var itemName = req.body.itemName;
  var itemQty = req.body.itemQty;
  var costPerItem = req.body.costPerItem;
  var totalCost = Number(req.body.costPerItem) * Number(req.body.itemQty);
  var itemDisp = req.body.Despription;
  var newData ={user: user, userid: userid, ItemNo: itemNo, ItemName: itemName, itemQty:itemQty, 
  costPerItem:costPerItem, totalCost: totalCost, itemDisp: itemDisp};
  Finished.create(newData, function(err, newlyCreated){
    if(err){
      req.flash("error", err.message);
    } else {
      req.flash("success","Successfully created");
      res.redirect("/work-page/finished-product");     
    }
  });
});

//update qty

router.put("/work-page/update-qty/:id", function(req, res){
	Finished.findById(req.params.id, function(err, item){
    if(err){
      console.log(err);
    } else {

    }
    var data = Number(item.itemQty) + Number(req.body.newQty);
    var tot = Number(item.totalCost) + (Number(req.body.newQty) * Number(item.costPerItem));
    var newData = {itemQty : data, totalCost: tot};
      Finished.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foundItem){
        if(err){
          req.flash("error", err.message);
        } else {
          res.redirect('/work-page/finished-product');
        }
      }); 
  });
});

module.exports = router;