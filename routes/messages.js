var express = require("express");
var router  = express.Router({mergeParams: true});
var User = require("../models/user");
var productionRow = require('../models/productionModel');
var User = require("../models/user");
var Inventory = require("../models/inventory");
var Finished = require("../models/finished");
var middleware = require("../middleware");
var Export = require("../models/export");
var Message = require("../models/message");

//message Create
router.post("/message",middleware.isLoggedIn,function(req, res){
  var count = 0;
  var id;
  User.find({}, function(err, founded){
    if(err){
      console.log(err);
    } else{
      var count = 0;
      founded.forEach(function(user){
        if(user.username === req.body.username){
          count = count + 1;
          if(count === 1){
            id= user.id;
          } else{
            console.log("not found");
          }
        }
      });
    }
    User.findById(id, function(err, foundeduser){
       if(err){
           console.log(err);
           res.redirect("/");
       } else {
        Message.create({text:req.body.message}, function(err, message){
           if(err){
               console.log(err);
           } else {
               //add username and id to comment
               message.author.id = req.user._id;
               message.author.username = req.user.firstName;
               //save message
               message.save();
               foundeduser.messages.push(message);
               foundeduser.save();
               //req.flash('success', 'Created a comment!');
               res.redirect('/work-page');
           }
        });
       }
   });
  });
});
// router.get("/:commentId/edit", middleware.isLoggedIn, function(req, res){
//     // find category by id
//     Comment.findById(req.params.commentId, function(err, comment){
//         if(err){
//             console.log(err);
//         } else {
//              res.render("comments/edit", {category_id: req.params.id, comment: comment});
//         }
//     })
// });

// router.put("/:commentId", function(req, res){
//    Comment.findByIdAndUpdate(req.params.commentId, req.body.comment, function(err, comment){
//        if(err){
//           console.log(err);
//            res.render("edit");
//        } else {
//            res.redirect("/anime/" + req.params.id);
//        }
//    }); 
// });

// router.delete("/:commentId",middleware.checkUserComment, function(req, res){
//     Comment.findByIdAndRemove(req.params.commentId, function(err, comment){
//         if(err){
//             console.log(err);
//             req.redirect("/category");
//         } else {
//             Category1.findByIdAndUpdate(req.params.id, {
//               $pull: {
//                 comments: comment.id
//               }
//             }, function(err) {
//               if(err){ 
//                 console.log(err)
//               } else {
//                 req.flash('error', 'Comment deleted!');
//                 res.redirect('/category/' + req.params.category + '/' + req.params.id);
//               }
//             });
//         }
//     });
// });

module.exports = router;