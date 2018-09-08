var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var Inventory = require("../models/inventory");
var Finished = require("../models/finished");
var Export = require("../models/export");


//update qty details
router.put("/work-page/reorder/:id", function(req, res,next){
  Inventory.findById(req.params.id, function(err, item){
    if(err){
      console.log(err);
    } else {
    }
    var data = Number(item.itemQty) + Number(req.body.newQty);
    var tot = Number(item.totalCost) + Number(req.body.newQty) * Number(item.costPerItem);
    var newData = {itemQty : data, totalCost: tot};
      
      Inventory.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, foundItem){
        if(err){
          req.flash("error", err.message);
        } else {
          res.redirect('/work-page/inventory-order/import');
        }
      }); 
  }); 
});

router.get("/work-page/inventory-order", function(req, res, next){
  res.render("inventoryOrder");
});

//import

router.get("/work-page/inventory-order/import", function(req, res, next){
  Inventory.find({}, function(err , allitems){
    if(err){
            console.log(err);
        } else {
            //redirect back to category page
            res.render("import",{allitems: allitems});
        }
  });
});

//import post route

router.post("/work-page/inventory-order/import", function(req, res){
  var user = req.user.username;
  var userid = req.user.id;
  var itemNo = req.body.itemNo;
  var itemName = req.body.itemName;
  var itemQty = req.body.ItemQty;
  var costPerItem = req.body.costPerItem;
  var totalCost = Number(req.body.costPerItem) * Number(req.body.ItemQty);
  var vendor = req.body.vendor;
  var vendorAdd = req.body.vendorAdd;
  var newData ={user: user, userid: userid, itemNo: itemNo, itemName: itemName, itemQty:itemQty, 
  costPerItem:costPerItem, totalCost: totalCost, vendor: vendor, vendorAdd: vendorAdd};
  Inventory.create(newData, function(err, newlyCreated){
    if(err){
      req.flash("error", err.message);
      res.redirect("/work-page/inventory-order/import");
      //return res.redirect("/work-page/inventory-order/import", {error: err.message});
    } else {
      req.flash("success","Successfully created");
      res.redirect("/work-page/inventory-order/import");     
    }
  });
});

router.get("/work-page/inventory-order/export",function(req, res){
  Finished.find({}, function(err, allitems){
    if(err){
      console.log(err);
    } else {
      Export.find({},function(err, exportitem){
        if(err){
          console.log(err);
        } else {
          res.render("export",{allitems: allitems, exportitem: exportitem});
        }
      })
      
    }
  });
});

router.post("/work-page/inventory-order/export-details", function(req, res){

  var itemNo = req.body.itemNo;
  var itemQty = req.body.itemQty;
  Finished.find({}, function(err,allitems){
    var id;
    var count = 0;
    if(err){
      console.log(err);
    } else{
      allitems.forEach(function(item){
        if(item.ItemNo === req.body.itemNo)
        {
          count = count + 1;
          id = item._id;
          if(count === 1){
            Finished.findById(id, function(err1,allproduct){
              if(err1){
                console.log(err);
              } else {
                data = Number(allproduct.itemQty) - Number(itemQty);
                totcost = Number(allproduct.totalCost) - Number(allproduct.costPerItem) * Number(itemQty);
                var newData = {itemQty: data, totalCost: totcost};
                Finished.findByIdAndUpdate(id, {$set: newData}, function(err2, newData){
                  if(err2){
                    req.flash("error", err.message);
                  } else {
                    var user = req.user.username;
                    var userid = req.user.id;
                    var itemNo = req.body.itemNo;
                    var itemName = allproduct.ItemName;
                    var itemQty = req.body.itemQty;
                    var costPerItem = allproduct.costPerItem;
                    var totalCost = Number(allproduct.costPerItem) * Number(req.body.itemQty);
                    var customerName = req.body.customerName;
                    var contactNo = req.body.contactNo;
                    var customerAddress = req.body.customerAddress;
          
                    var exportData ={user:user, userid:userid, ItemNo: itemNo, ItemName: itemName, itemQty:itemQty,costPerItem:costPerItem,
                    totalCost: totalCost, CustomerName: customerName, CustomerContact: contactNo, 
                    CustomerAddress: customerAddress};

                    Export.create(exportData, function(err3, newlyCreated){
                    if(err3){
                      console.log(err3);
                      } else {
                        req.flash("success","Successfully created");
                        res.redirect("/work-page/inventory-order/export");     
                      }
                    });
                  }
                });
              }
            });
          } else {
            req.flash("error", "To many product found exit.");
            res.redirect("/work-page/inventory-order/export");
          }
        }
    });
    }
  });
});

module.exports = router;