const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var messages = mongoose.model('Messages');
var user = mongoose.model('User');
var moment = require('moment');

const jwt = require('jsonwebtoken');

router.get("/get_lastmessage",verifyToken, (req, res) => {
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {

            if(authData.user.key!=req.query.res_id )
            {
                
                res.sendStatus(403);
                return;
            }
            messages.aggregate([
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
                        res_id:req.query.res_id
                    }
                },
                        
                {
                    $unwind:
                    {
                        path: "$info",
                        preserveNullAndEmptyArrays: false
                      }
                },
              
                {
                    $group:
                    {
             
                    lastmessage: { $last: "$mess"}, 
                    _id:{ sender_id:"$sender_id",sender_id:"$info"},
                   date:{ $last:"$date"}
        
                           
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





router.get("/get_allmessages", verifyToken,(req, res) => {
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.query.res_id )
            {
                
                res.sendStatus(403);
                return;
            }
            messages.aggregate([
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
                    $lookup:
                    {
                        from: 'users',
                        localField: 'res_id',
                        foreignField: '_id',
                        as: 'go'
                    }
                },
                {
                    $match:
                    {
                        $or: [ { res_id:req.query.res_id,sender_id:req.query.sender_id},{ res_id:req.query.sender_id,sender_id:req.query.res_id}]
                       
                    }
                },
                        
                {
                    $project:
                    {
                        _id:0,
                     messages:{ $concatArrays: ['$info',['$mess'],['$date']] }
                      }
                },
              
                
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




router.route('/post_message').post(verifyToken,function (req, res) {
  
   
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
            var add = new messages();
            
            add.sender_id = req.body.sender_id;
            add.res_id = req.body.res_id;
            add.mess = req.body.mess;
            add.date=moment().format("YYYY/MM/DD");
          
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                } else {
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