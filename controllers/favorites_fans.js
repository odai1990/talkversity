const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Favorites_Fans = mongoose.model('Favorites_fans');


const jwt = require('jsonwebtoken');


router.get("/get_favorite",verifyToken, (req, res) => {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.query.fan_id)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            Favorites_Fans.aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "favorite_id",
                        foreignField: "_id",
                        as: "favorites"
                    }
                },
                {
                    $match:
                    {
                        fan_id:req.query.fan_id
                    }
                },
                
                {
                    $unwind:
                    {
                        path: "$favorites",
                        includeArrayIndex: '0',
                         
                        preserveNullAndEmptyArrays: true
                      }
                },
              
                {
                    $group:
                    {
                    '_id': 0,
                            'favorites': { $push: "$favorites" },
                           
                    }
                },
                {
                    $project:
                    {
                        _id:0,
                        favorites:1
                    }
                }
                ,
               
            ], function (err, result) {
                
                if(result!="")
                {
                    res.send(JSON.stringify(result[0]['favorites']));
                }else
                {
                res.send(null);
                }
              
            });
        }
      });
     

});









router.route('/post_favorite').post(verifyToken,function (req, res) {
   

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.fan_id)
            {
                
                res.sendStatus(403);
                return;
            }
            Favorites_Fans.find({ fan_id: req.body.fan_id, favorite_id: req.body.favorite_id }, (err, doc) => {
                if (doc == "") {
                    var add = new Favorites_Fans();
            
                    add.fan_id = req.body.fan_id;
                    add.favorite_id = req.body.favorite_id;
                  
                    add.save((err, doc) => {
                        if (err) {
                            res.end("We couldn't save your data please try later!");
                        } else {
                            res.end("Your data is added successfully");
                        }
                
                
                    });
                    }else
                        {
                            res.end("This user is already in favorites list !")
                        }
            });
        }
      });


  


});





router.get("/get_fan",verifyToken, (req, res) => {
      
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.query.favorite_id)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            Favorites_Fans.aggregate([
                {
                    $lookup:
                    {
                        from: "users",
                        localField: "fan_id",
                        foreignField: "_id",
                        as: "fans"
                    }
                },
                {
                    $match:
                    {
                        favorite_id:req.query.favorite_id
                    }
                },
                
                {
                    $unwind:
                    {
                        path: "$fans",
                        includeArrayIndex: '0',
                         
                        preserveNullAndEmptyArrays: true
                      }
                },
              
                {
                    $group:
                    {
                    '_id': 0,
                            'fans': { $push: "$fans" },
                           
                    }
                },
                {
                    $project:
                    {
                        _id:0,
                        fans:1
                    }
                }
                ,
               
            ], function (err, result) {
                if(result!="")
                {
                    res.send(JSON.stringify(result[0]['fans']));
                }else
                {
                res.send(null);
                }
                
            });
        }
      });




});




router.route('/delete_favorite').delete(verifyToken,function (req, res) {
  


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
             if(authData.user.key!=req.body.fan_id)
            {
                
                res.sendStatus(403);
                return;
            }
            Favorites_Fans.findOneAndDelete({fan_id:req.body.fan_id,favorite_id:req.body.favorite_id},(err,doc)=>{
                if (err) {
                    res.end("We couldn't delete your data, please try later!");
                } else {
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