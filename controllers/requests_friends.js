const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Requests_friends = mongoose.model('Requests_friends');
var Friend = mongoose.model('Friends');



const jwt = require('jsonwebtoken');

router.get("/get_request",verifyToken, (req, res) => {
    
       
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!= req.query.request_id )
            {
                
                res.sendStatus(403);
                return;
            }
            Requests_friends.aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "primary_user",
                        foreignField: "_id",
                        as: "requestes"
                    }
                },
                {
                    $match:
                    {
                        request_id:req.query.request_id
                    }
                },
                
                {
                    $unwind:
                    {
                        path: "$requestes",
                        includeArrayIndex: '0',
                         
                        preserveNullAndEmptyArrays: true
                      }
                },
              
                {
                    $group:
                    {
                    '_id': 0,
                            'requestes': { $push: "$requestes" },
                           
                    }
                },
                {
                    $project:
                    {
                        _id:0,
                        requestes:1
                    }
                }
                ,
               
            ], function (err, result) {
                if(result!="")
                {
                    res.send(JSON.stringify(result[0]['requestes']));
                }else
                {
                res.send(null);
                }
              
            });
        }
    });

    

   

});


router.delete("/delete_request", verifyToken,(req, res) => {
   

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
            if(authData.user.key!= req.body.primary_user )
            {
                
                res.sendStatus(403);
                return;
            }
            Requests_friends.findOneAndDelete({ $or: [ {primary_user:req.body.primary_user,request_id:req.body.request_id   }, {primary_user:req.body.request_id,request_id:req.body.primary_user } ] },(err,doc)=>{
                if (err) {
                    res.end(null);
                } else {
                   
                    res.end("Your data is deleted successfully");
                }
            }          
            );
        }
    });




});






router.post("/confirm_request", verifyToken,(req, res) => {
   

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!= req.body.primary_user )
            {
                
                res.sendStatus(403);
                return;
            }
            var add = new Friend();
               
               add.primary_user = req.body.primary_user;
               add.friend_id = req.body.request_id;
             
             
               add.save((err, doc) => {
                   if (err) {
                       res.end("We couldn't save your data please try later!");
                   } else {
                       var add = new Friend();
                       add.friend_id = req.body.primary_user;
                       add.primary_user = req.body.request_id;
                       add.save();
           
                       Requests_friends.findOneAndDelete({ $or: [ {primary_user:req.body.primary_user,request_id:req.body.request_id }, {primary_user:req.body.request_id,request_id:req.body.primary_user } ] },(err,doc)=>{
                           if (err) {
                               res.end("We couldn't delete your data, please try later!");
                           } else {
                              
                               res.end("Your data is deleted successfully");
                           }
                       }          
                       );
           
                       
                       
                       res.end("Your data is added successfully");
                   }
           
           
               });
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