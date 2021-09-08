const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var gift = mongoose.model('Gift');
var moment = require('moment');
var user = mongoose.model('User');
var level_points = mongoose.model('Level_Point');
const jwt = require('jsonwebtoken');


router.route('/post_gift').post(verifyToken,function (req, res) {




 
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
            if(authData.user.key!=req.body.sender_id )
            {
                
                res.sendStatus(403);
                return;
            }
            let coinss=0;
                             
                 let user_s=""
                 let user_r=""                 

             user.find({_id : {$in : [req.body.sender_id,req.body.rec_id]}},  (err, doc) => {
               
                if(doc!="")
                {
                    if(req.body.sender_id==doc[0]["_id"])
                    {
                        if(parseInt(doc[0]['coins'])-parseInt(req.body.price)>=0)
                        {
                        coinss=parseInt(doc[0]['coins'])-parseInt(req.body.price);
                        }
                        else
                        {
                            
                            res.send("You don't have enough money");
                            return;
                        }
                    }else{
                        if(parseInt(doc[1]['coins'])-parseInt(req.body.price)>=0)
                        {
                        coinss=parseInt(doc[1]['coins'])-parseInt(req.body.price);
                        }
                        else
                        {
                            
                            res.send("You don't have enough money");
                            return;
                        }
                    }
              
         
         
                  var add = new gift();
             
             add.sender_id = req.body.sender_id;
             add.rec_id = req.body.rec_id;
             add.date = moment().format('l');
             add.time =  moment().format('h:m:s a');
             add.price = req.body.price;
             add.src = req.body.src;
             add.name=req.body.name;
             add.gender=req.body.gender
           
           
             add.save((err, doc) =>  {
               
         
             });
           if(doc[1]["_id"]==req.body.sender_id )
           {
               user_s=doc[1]['points']
               user_r=doc[0]['points']
           }else{
            user_s=doc[0]['points']
            user_r=doc[1]['points']
           }
             





           level_points.aggregate([
            {
                $match:
                {
                    $and: [{ points: { $lte: parseInt(parseInt(user_s)+parseInt(req.body.s_point)) } }]
                }
            },
            {
    
                $group:
                {
                    _id: 0,
                    level: { $last: "$level" },
                    poins: { $last: "$points" },
    
                }
            }
    
    
    
        ], function (err, result) {
    
     
          
                user.findOneAndUpdate({ _id: req.body.sender_id }, {
                    $set: {
                        points: parseInt(user_s)+parseInt(req.body.s_point),
                        coins:coinss,
                       level:JSON.stringify(result[0].level) 
                    }
                }, { new: true }, (err, doc) => {
                   console.log("1")
                });
   
    
        });









                    


















             level_points.aggregate([
                {
                    $match:
                    {
                        $and: [{ points: { $lte: parseInt(parseInt(user_r)+parseInt(req.body.r_point)) } }]
                    }
                },
                {
        
                    $group:
                    {
                        _id: 0,
                        level: { $last: "$level" },
                        poins: { $last: "$points" },
        
                    }
                }
        
        
        
            ], function (err, result) {
        
                user.findOneAndUpdate({ _id: req.body.rec_id }, {
                    $set: {
                        points: parseInt(user_r)+parseInt(req.body.r_point),
                       
                        level:JSON.stringify(result[0].level)
                    }
                }, { new: true }, (err, doc) => {
                    res.send("Your data is updated successfully")
                    return;
                });
            
                   
               
        
            });






         
           
         
















         
                }else
                {
                    res.send("Your request not executed successfully")
                    return;
                }
                
         })



        }
    });




  
});


router.route('/get_gifts').get(verifyToken,function (req, res) {
 

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.query.rec_id)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            gift.aggregate([
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'sender_id',
                        foreignField: '_id',
                        as: 'info'
                    }
                },
                {
                    $match:
                    {
                        rec_id:req.query.rec_id
                    }
                }
                ,
               
            ], function (err, result) {
                
                if(result!="")
                {
                    res.send(JSON.stringify(result));
                }else
                {
                res.send(null);
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