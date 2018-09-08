var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var productionRow = require('../models/productionModel');
var User = require("../models/user");
var Inventory = require("../models/inventory");
var Finished = require("../models/finished");
var middleware = require("../middleware");
var Export = require("../models/export");
var rawSheet = require("../models/rawSheet");
var productSheet = require("../models/productSheet");
//product section
var ShopsModel = require("../models/shops");
var Col = require("../models/col");
var Value = require("../models/value");


router.get("/admin/admin-pannel/inventory", function(req, res, next){
	Inventory.find({}, function(err, allitems){
		if(err){
			console.log(err);
		} else {
			Finished.find({}, function(err, allfinished){
				if(err){
					console.log(err);
				} else {
					console.log(req.user.username);
					res.render("admin/inventory",{allitems: allitems, allfinished: allfinished});
				}
			})
			
		}
	});
});

//salis department

router.get("/admin/admin-pannel/sails", function(req, res, next){
	Export.find({}, function(err, exportitem){
		if(err){
			console.log(err);
		} else {
			var totalSail = 0;
			exportitem.forEach(function(exportitems){
				totalSail = totalSail + exportitems.totalCost;
			});
			res.render("admin/sails", {exportitem: exportitem, totalSail: totalSail});
		}
	});
});

//submitions
router.get("/admin/admin-pannel/submitions",middleware.isLoggedIn,function(req,res){
	Inventory.find({"updatedOn": {$gt:new Date(Date.now() - 24*60*60 * 1000)}},function(err,allinventory){
		if(err){
			console.log(err);
		} else{
			var totalinventory = 0;
			allinventory.forEach(function(allinventory){
				totalinventory = totalinventory + 1;
			});
			Export.find({"SellDate": {$gt:new Date(Date.now() - 24*60*60 * 1000)}},function(err,allexport){
				if(err){
					console.log(err);
				} else{
					var totalexport = 0;
					allexport.forEach(function(allexport){
						totalexport = totalexport + 1;
					});
					Finished.find({"LastUpdated": {$gt:new Date(Date.now() - 24*60*60 * 1000)}},function(err,allfinished){
						if(err){
							console.log(err);
						} else{
							var totalfinished = 0;
							allfinished.forEach(function(allfinished){
								totalfinished = totalfinished + 1;
							});
							productionRow.find({"createdOrderAt": {$gt:new Date(Date.now() - 24*60*60 * 1000)}},function(err,allproduction){
								if(err){
									console.log(err);
								} else{
									var totalproduction = 0;
									allproduction.forEach(function(allproduction){
										totalproduction = totalproduction + 1;
									});
									res.render("admin/submitions",{totalproduction: totalproduction, totalfinished: totalfinished, totalexport:totalexport, totalinventory: totalinventory, allinventory: allinventory , allexport: allexport, allfinished: allfinished, allproduction: allproduction});
								}
							});
						}
					});
				}
			});
		}
	});
});

//showing master table
router.get("/admin/admin-pannel/masterSheet",middleware.isLoggedIn,function(req, res){
	res.render("admin/masterSheet");
});

//showing rawmterial list
router.get("/admin/admin-pannel/raw-Material-List",middleware.isLoggedIn,function(req, res){
	rawSheet.find({},function(err, raw){
		if(err){
			console.log(err);
		} else {
			res.render("admin/raw_material_list",{raw:raw});
		}
	})
});

//saving rawmaterial list
router.post("/admin/admin-pannel/raw-Material-List",middleware.isLoggedIn,function(req, res){
 var itemNo = req.body.itemNo.toLowerCase();
 var itemName = req.body.itemName.toLowerCase();
 var desc = req.body.desc.toLowerCase();
 var costPerItem = req.body.costPerItem;
 var user = req.user.username.toLowerCase();
 var newData ={itemNo: itemNo, itemName: itemName, desc: desc, costPerItem: costPerItem, user: user};
 rawSheet.create(newData, function(err, newlyCreated){
    if(err){
      req.flash("error", "CANNOT BE THE SAME ITEM NO!");
      res.redirect("/admin/admin-pannel/raw-Material-List");
    } else {
      req.flash("success","Successfully created");
      res.redirect("/admin/admin-pannel/raw-Material-List");     
    }
  });
});

//showing employee list
router.get("/admin/admin-pannel/employee-list",middleware.isLoggedIn,function(req, res){
	User.find({},function(err, employee){
		if(err){
			console.log(err);
		} else {
			res.render("admin/employee-list",{employee:employee});
		}
	});
	
});

//showing product list
router.get("/admin/admin-pannel/product-List",middleware.isLoggedIn,function(req, res){
	productSheet.find({},function(err, product){
		if(err){
			console.log(err);
		} else {
			//console.log(product);
			res.render("admin/product_list",{product:product});
		}
	})
});

//saving product sheet list
router.post("/admin/admin-pannel/product-List",middleware.isLoggedIn,function(req, res){
 var itemNo = req.body.itemNo.toLowerCase();
 var itemName = req.body.itemName.toLowerCase();
 var desc = req.body.desc.toLowerCase();
 var costPerItem = req.body.costPerItem;
 var user = req.user.username.toLowerCase();
 var newData ={itemNo: itemNo, itemName: itemName, desc: desc, costPerItem: costPerItem, user: user};
 productSheet.create(newData, function(err, newlyCreated){
    if(err){
      req.flash("error", "CANNOT BE THE SAME ITEM NO!");
      res.redirect("/admin/admin-pannel/product-List");
    } else {
      req.flash("success","Successfully created");
      res.redirect("/admin/admin-pannel/product-List");     
    }
  });
});

//production shops

router.get("/admin/admin-pannel/production-shops",middleware.isLoggedIn,function(req, res){
	ShopsModel.find({},function(err, allshops){
		if(err){
			console.log(err);
		} else {
			User.find({},function(err, employee){
				if(err){
					console.log(err);
				} else {
					res.render("admin/shops",{allshops:allshops, employee:employee});
				}
			});
		}
	});
});

//post route of shopCreat
router.post("/admin/admin-pannel/production-shops",middleware.isLoggedIn,function(req, res){
 var name = req.body.HandelBy.toLowerCase();
 var shopName = req.body.shopName.toLowerCase();

 var newData ={name: name, shopName: shopName};
 ShopsModel.create(newData, function(err, newlyCreated){
    if(err){
      req.flash("error", "SOMETHING WENT WRONG");
      res.redirect("/admin/admin-pannel/production-shops");
    } else {
      req.flash("success","Successfully created");
      res.redirect("/admin/admin-pannel/production-shops");     
    }
  });
});

//main production form
router.get("/admin/admin-pannel/production-shops/:id",middleware.isLoggedIn,function(req, res){
	ShopsModel.findById(req.params.id).populate("cols").exec(function(err, foundcol){
		if(err){
			console.log(err);
		} else {
			ShopsModel.find({},  function(err, allshops){
				if(err){
					console.log(err);
				} else {
					res.render("admin/mainProduction",{foundcol:foundcol, allshops:allshops });
					//console.log("created");
				}
			})
			
		}
	});
});

//creating col
router.post("/new/col/:id",middleware.isLoggedIn,function(req, res){
    ShopsModel.findById(req.params.id, function(err, foundedshop){
       if(err){
           console.log(err);
           req.flash('error', 'Someting went wrong');
           res.redirect("/admin/admin-pannel/production-shops/:id");
       } else {
	        Col.create({text:req.body.Newcol}, function(err, col){
	           if(err){
	               console.log(err);
	           } else {
	               col.save();
	               foundedshop.cols.push(col);
	               foundedshop.save();
				   req.flash('success', 'Created a col!');
	               res.redirect('back');
	               //console.log("created");
	           }
	        });
        }
   	});
});
//creating column

//work page
router.get("/admin/admin-pannel/schedular",middleware.isLoggedIn, function(req, res){
    User.find({}).populate("tasks").exec(function(err, foundUser){
        if(err){
          console.log(err);
        } else {
            User.findById(req.user.id).populate("messages").exec(function(err, employee){
                if(err){
                    console.log(err);
                } else {
                    User.findById(req.user.id).populate("tasks").exec(function(err, foundtask){
                        if(err){
                            console.log(err);
                        } else {
                            res.render("admin/scheduler",{employee:employee, foundUser:foundUser, foundtask:foundtask});
                        }
                    })
                    
                }
            });
        }
    });
});


module.exports = router;