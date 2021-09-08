const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var ban_block = mongoose.model('Ban_Block');
var user = mongoose.model('User');

const jwt = require('jsonwebtoken');





router.route('/add_block_ban').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.blocker_bander )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            ban_block.findOne({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, (err, doc) => {
                if (doc == null) {
        
                    var add = new ban_block();
        
                    add.blocker_bander = req.body.blocker_bander;
                    add.block = req.body.block;
                    add.ban = req.body.ban;
                    add.blocked_banned = req.body.blocked_banned;
        
                    add.save((err, doc) => {
                        if (err) {
                            res.end("We couldn't save your data please try later!");
                        } else {
                            res.end("This user is addded successfully");
                        }
        
        
        
                    });
                } else {
        
                    ban_block.findOneAndUpdate({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, { $set: { block: req.body.block, ban: req.body.ban } }, { new: true }, (err, doc) => {
        
                    });
                    res.end("This user is addded successfully");
                }
            })
        }
      });

      



});







router.route('/delete_ban_block').delete(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.blocker_bander )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            if (req.body.type == "block" && req.body.ban == "1") {
                ban_block.findOneAndUpdate({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, { $set: { block: "0", ban: req.body.ban } }, { new: true }, (err, doc) => {
        
                });
                res.end("This user is addded successfully");
            } else if (req.body.type == "block" && req.body.ban == "0") {
                ban_block.findOneAndDelete({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, (err, doc) => {
                    if (err) {
                        res.end(null);
                    } else {
                        res.end("Your data is deleted successfully");
                    }
                }
                );
            } else if (req.body.type == "ban" && req.body.block == "1") {
                ban_block.findOneAndUpdate({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, { $set: { block: req.body.block, ban: "0" } }, { new: true }, (err, doc) => {
        
                });
                res.end("This user is addded successfully");
            } else if (req.body.type == "ban" && req.body.block == "0") {
                ban_block.findOneAndDelete({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, (err, doc) => {
                    if (err) {
                        res.end(null);
                    } else {
                        res.end("Your data is deleted successfully");
                    }
                }
                );
            }
        }
      });

      



});




router.route('/delete_ban_block_array').delete(verifyToken,function (req, res) {
    

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.blocker_bander )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            for(var i in req.body.blocks)
            {
        
                ban_block.findOneAndDelete({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned[i] }] }, (err, doc) => {
                   
                });
                     if(req.body.blocks[i] =="0" && req.body.bans[i]=="0")
                {
                   
                 }else{
                    var add = new ban_block();
        
                add.blocker_bander = req.body.blocker_bander;
                add.block = req.body.blocks[i];
                add.ban = req.body.bans[i];
                add.blocked_banned = req.body.blocked_banned[i];
        
                add.save((err, doc) => { });
                }
              
        
               
            }
        
            res.end("Your list is modified");
        }
      });


  

});


router.route('/get_ban_and_block').get(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.query.uid)
            {
                
                res.sendStatus(403);
                return;
            }
            ban_block.aggregate([
                {
                    $match:
                    {
        
                        blocker_bander: req.query.uid
        
                    }
                },
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "blocked_banned",
                        foreignField: "_id",
                        as: "info_user"
                    }
        
                },
        
        
        
        
        
            ], function (err, result) {
                if (result != "") {
                    res.send(JSON.stringify(result));
                } else {
                    res.send(null);
                }
        
            });
        }
      });

      



});


router.route("/block_user").put(verifyToken,function(req,res)
{

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            user.findOneAndUpdate({ _id: req.body.uid }, {
                $set: {
                    block: req.body.block,
                   
                }
            }, { new: true }, (err, doc) => {
                if(err)
                {
                    res.send("node ")
                }else{
                    res.end("You have Blocked this user successfully");
                }
            });
        }
      });

      

})
router.route("/ban_user").put(verifyToken,function(req,res)
{
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            user.findOneAndUpdate({ _id: req.body.uid }, {
                $set: {
                    ban: req.body.ban,
                   
                }
            }, { new: true }, (err, doc) => {
                if(err)
                {
                    res.send("node ")
                }else{
                    res.end("You have Baned this user successfully");
                }
            });
        }
      });

      
})




function verifyToken(req, res, next) {
    // Get auth header value
    const bearerHeader = req.headers['authorization'];
    // Check if bearer is undefined
    if(typeof bearerHeader !== 'undefined') {
      // Split at the space
      const bearer = bearerHeader.split(' ');
      // Get token from array
      const bearerToken = bearer[1];
      // Set the token
      req.token = bearerToken;
      // Next middleware
      next();
    } else {
      // Forbidden
      res.sendStatus(403);
    }
  
  }


module.exports = router;