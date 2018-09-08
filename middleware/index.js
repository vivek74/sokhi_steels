var User = require("../models/user");
module.exports = {
    isLoggedIn: function(req, res, next){
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "You must be signed in to do that!");
        //alert("Must signed to that");
        res.redirect("/");
    },

    onlyAdmin: function(req, res, next){
        if(req.isAuthenticated()){
            User.findById(req.user.id, function(err, user){
               //console.log(req.user.id);
               if(req.user.employee === 'admin'){
                   next();
               } else {
               	   req.logout();
                   req.flash("error", "You don't have permission to do that !");
                   res.redirect("/");
               }
            });
    	}
    }
}