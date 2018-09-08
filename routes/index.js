var express = require("express");
var router  = express.Router();
var passport = require("passport");
var User = require("../models/user");
var middleware = require("../middleware");
var shortid = require('shortid');


//routes
router.get("/", function(req, res, next){
  req.logout();
  res.render("landing");
});

//create new employee
router.get("/admin/admin-pannel/create-new-employee", function(req, res){
    res.render("signup");
});

//admin starting page(addmin pannel)
router.get("/admin/admin-pannel/employee-details", middleware.isLoggedIn, function(req, res){
    User.find({}, function(err , allemployee){
        if(err){
            console.log(err);
        } else {
            //redirect back to category page
            res.render("employee-details",{allemployee: allemployee});
        }
    });
});

//work page
router.get("/work-page",middleware.isLoggedIn, function(req, res){
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
                            res.render("workPage",{employee:employee, foundUser:foundUser, foundtask:foundtask});
                        }
                    })
                    
                }
            });
        }
    });
});

//handel signup process
router.post("/admin/create-new-employee", function(req, res){
	//console.log(req.body);
    var newUser = new User({
        employee: req.body.employeeRole.toLowerCase(),
    	username: req.body.userid,
        employeeid: shortid.generate(),
        passwordCopy: req.body.password,
        firstName: req.body.firstname.toLowerCase(),
        lastName: req.body.lastname.toLowerCase(),
        phone: req.body.phoneno,
        age: req.body.age,
        address: req.body.address,
        city: req.body.city.toLowerCase(),
        state: req.body.state.toLowerCase(),
        zip: req.body.zip,
        employeeType: req.body.employeeType,
        email: req.body.email
    });

    if(req.body.adminCode === 'sokhi123')
    {
      newUser.isAdmin = true;
    } else if(req.body.employeeType === 'inventry')
    {
    	newUser.isInventry = true;
    } else if(req.body.employeeType === 'production')
    {
    	newUser.isProduction = true;
    } else if(req.body.employeeType === 'sails')
    {
    	newUser.isSails = true;
    } else if(req.body.employeeType === 'scheduler')
    {
        newUser.isScheduler = true;
    }

    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("signup", {error: err.message});
        }else{
        	res.redirect("/admin/admin-pannel/employee-details");
        }
    });
});

//handling login
router.post("/login", passport.authenticate("local", 
    {
        failureRedirect: "/",
        failureFlash: true,
    }), function(req, res){
    res.redirect("/work-page");
});

// logout route
router.get("/logout", function(req, res){
   req.logout();
   req.flash("success","Successfully Logged Out!");
   res.redirect("/");
}); 

module.exports = router;