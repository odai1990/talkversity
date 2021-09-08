const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Friend = mongoose.model('Friends');
var Requests_friends = mongoose.model('Requests_friends');

const jwt = require('jsonwebtoken');
router.route('/post_friend').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.primary_user)
    {
        
        res.sendStatus(403);
        return;
    }
            Friend.find({ $or: [ { friend_id: req.body.primary_user, primary_user: req.body.request_id }, { friend_id: req.body.request_id, primary_user: req.body.primary_user  } ] } ,(err,doc)=>{
                if(doc == "")
                {
                  
                    Requests_friends.find({ primary_user: req.body.primary_user, request_id: req.body.request_id }, (err, doc) => {
                        if (doc == "") {
                            
                            var add = new Requests_friends();
                    
                            add.primary_user = req.body.primary_user;
                            add.request_id = req.body.request_id;
                          
                          
                            add.save((err, doc) => {
                                if (err) {
                                    res.end("We couldn't save your data please try later!");
                                } else {
                                   
                                    res.end("Your data is added successfully");
                                }
                        
                        
                            });
                            }else
                                {
                                    res.end("This user is already in requests list !")
                                }
                    })
                }else
                {
                
                res.end("This user is already in friends list !")
                }
            })
        }
      });
      
    
  
   

   

});


router.route('/get_friend').get(verifyToken,function (req, res) {
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.query.primary_user)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            Friend.aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "friend_id",
                        foreignField: "_id",
                        as: "friends"
                    }
                },
                {
                    $match:
                    {
                        primary_user:req.query.primary_user
                    }
                },
                
                {
                    $unwind:
                    {
                        path: "$friends",
                        includeArrayIndex: '0',
                         
                        preserveNullAndEmptyArrays: true
                      }
                },
              
                {
                    $group:
                    {
                    '_id': 0,
                            'friends': { $push: "$friends" },
                           
                    }
                },
                {
                    $project:
                    {
                        _id:0,
                        friends:1
                    }
                }
                ,
               
            ], function (err, result) {
                
                if(result!="")
                {
                    res.send(JSON.stringify(result[0]['friends']));
                }else
                {
                res.send(null);
                }
              
            });
        }
      });
      
    
  

    
});



router.route('/delete_friend').delete(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.primary_user)
            {
                
                res.sendStatus(403);
                return;
            }
            Friend.findOneAndDelete({primary_user:req.body.primary_user,friend_id:req.body.friend_id},(err,doc)=>{
                if (err) {
                    res.end("We couldn't delete your data, please try later!");
                } else {
                    Friend.findOneAndDelete({primary_user:req.body.friend_id,friend_id:req.body.primary_user},(err,doc)=>{
                        if (err) {
                            res.end(null);
                        } else {
                            res.end("Your data is deleted successfully");
                        }
                    }          
                    );
                    res.end("Your data is deleted successfully");
                }
            }          
            );
        }
      });



});


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