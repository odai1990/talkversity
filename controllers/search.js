const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');



const jwt = require('jsonwebtoken');




router.get("/query", verifyToken,(req, res) => {


    // user.find( { $and: [ { number:{'$regex': req.query.id}},{ FirstName:{'$regex': req.query.firstname }},{ Birthday:{'$regex': req.query.age}},{ Country:{'$regex': req.query.country}},{ Gender:{'$regex': req.query.gender}},{ state:{'$regex': req.query.state}}]},(err,doc)=>
    // {
    //    res.send(JSON.stringify(doc));
    // });

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            var age = [];
            if (req.query.start !== "" && req.query.end !== "") {
                let newDate = new Date()
                let year = newDate.getFullYear();
                for (var i = req.query.start; i <= req.query.end; i++) {
                    var temb = year - i;
                    var re = new RegExp(temb);
        
        
                    age.push(re);
        
                }
            }
            else {
                age.push(/.*/);
            }
        
        
            user.aggregate([
        
                {
                    $match:
                    {
        
                        $and: [{ _id: { $not: { $eq: req.query.uid} } }, { number: { '$regex': req.query.id } }, { FirstName: { '$regex': req.query.firstname
                        , '$options' : 'i'  } }, { Birthday: { $in: age } }, { Country: { '$regex': req.query.country
                        , '$options' : 'i'  } }, { Gender: { '$regex': req.query.gender
                        , '$options' : 'i'  } }, { state: { '$regex': req.query.state
                        , '$options' : 'i'  } }]
                    }
                },
                {
                    $addFields:
                    {
        
                        uid: req.query.uid
        
                    }
                },
        
        
                {
                    $lookup:
                    {
                        from: 'friends',
                        let: {
                            article_id: "$uid",
                            self: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$friend_id", "$$self"] },
                                            { $eq: ["$primary_user", "$$article_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
        
                        as: 'friend'
        
                    }
                },
                {
                    $lookup:
                        {
                        from: 'enemies',
                        let: {
                            article_id: "$uid",
                            self: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$enemy_id", "$$self"] },
                                            { $eq: ["$user_id", "$$article_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
        
                        as: 'enemy'
        
                    }
                },
                {
                    $lookup:
                    {
                        from: 'favorites_fans',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$favorite_id","$$self" ] },
                                    { $eq: [ "$fan_id", "$$article_id" ] }
                                ] }
                            } }
                          ],
                        
                        as: 'favorites_friends'
                        
                      }
                },
                
               
                {
                    $lookup:
                    {
                        from: 'requests_friends',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: {
                        
                                                $or : 
                        [
                          {$and: [
                             { $eq: [  "$primary_user","$$self" ] },
                                    { $eq: [ "$request_id", "$$article_id" ] }
                            ]},
                          {$and: [
                             { $eq: [  "$request_id","$$self" ] },
                                    { $eq: [ "$primary_user", "$$article_id" ] }
                            ]}] 
                                    
                                    
                                    }
                            } }
                          ],
                        
                        as: 'request'
                        
                      }
                },
                {
                    $lookup:
                    {
                        from: 'powers',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'powers'
                      }
                },
                
                {
                    $lookup:
                    {
                        from: 'vip_shields',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'vip_shield'
                      }
                },
                {
                  $lookup:
                  {
                    from: 'requests_friends',
                    let: {
                        article_id: "$uid",
                        self:"$_id"
                      },
                        pipeline: [
                        { $match: {
                            $expr: { $and: [
                                { $eq: [  "$primary_user","$$self" ] },
                                { $eq: [ "$request_id", "$$article_id" ] }
                            ] }
                        } }
                      ],
                    
                    as: 'confirm'
                    
                  }  
                },
                {
                    $project:
                    {
                        _id:1,
                        FirstName:1,
                        LastName:1,
                        Gender:1,
                        Phone:1,
                        Country:1,
                        Birthday:1,
                        src:1,
                        number:1,
                        state:1,
                        hide_friends:1,
                        hide_gifts:1,
                        hide_status:1,
                        hide_visitors:1,
                        chat_private:1,
                        can_message:1,
                        powers:1,
                        points:1,
                        level:1,
                        coins:1,
                        role:1,
                        ban:1,
                        block:1,
                        vip_shield:1,
                       Admin_id:1,      
                        friend:{$size:"$friend"},
                        enemy:{$size:"$enemy"},
                        favorites_friends:{$size:"$favorites_friends"},
                      
                        request:{$size:"$request"},
                        confirm:{$size:"$confirm"}
                      }
                }
                ,
        
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















router.get("/query_chat",verifyToken, (req, res) => {


   
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
           
            // if(authData.user.key!= req.query.uid )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            user.aggregate([
        
                {
                    $match:
                    {
        
                         _id: req.query.id  
                    }
                },
                {
                    $addFields:
                    {
        
                        uid: req.query.uid
        
                    }
                },
        
        
                {
                    $lookup:
                    {
                        from: 'friends',
                        let: {
                            article_id: "$uid",
                            self: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$friend_id", "$$self"] },
                                            { $eq: ["$primary_user", "$$article_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
        
                        as: 'friend'
        
                    }
                },
                {
                    $lookup:
                        {
                        from: 'enemies',
                        let: {
                            article_id: "$uid",
                            self: "$_id"
                        },
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $and: [
                                            { $eq: ["$enemy_id", "$$self"] },
                                            { $eq: ["$user_id", "$$article_id"] }
                                        ]
                                    }
                                }
                            }
                        ],
        
                        as: 'enemy'
        
                    }
                },
                {
                    $lookup:
                    {
                        from: 'favorites_fans',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$fan_id","$$self" ] },
                                    { $eq: [ "$favorite_id", "$$article_id" ] }
                                ] }
                            } }
                          ],
                        
                        as: 'favorites_friends'
                        
                      }
                },
                
                
                {
                    $lookup:
                    {
                        from: 'requests_friends',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: {
                        
                                                $or : 
                        [
                          {$and: [
                             { $eq: [  "$primary_user","$$self" ] },
                                    { $eq: [ "$request_id", "$$article_id" ] }
                            ]},
                          {$and: [
                             { $eq: [  "$request_id","$$self" ] },
                                    { $eq: [ "$primary_user", "$$article_id" ] }
                            ]}] 
                                    
                                    
                                    }
                            } }
                          ],
                        
                        as: 'request'
                        
                      }
                },
                {
                    $lookup:
                    {
                        from: 'powers',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'powers'
                      }
                },
                
                {
                    $lookup:
                    {
                        from: 'vip_shields',
                        localField: '_id',
                        foreignField: 'user_id',
                        as: 'vip_shield'
                      }
                },
                {
                    $lookup:
                    {
                        from: 'ban_blocks',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$self" ] },
                                    { $eq: [  "$ban","1" ] },
                                    { $eq: [ "$blocker_bander", "$$article_id" ] }
                                ] }
                            } }
                          ],
                        
                        as: 'ban_live'
                        
                      }
                },
                {
                    $lookup:
                    {
                        from: 'ban_blocks',
                        let: {
                            article_id: "$uid",
                            self:"$_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$self" ] },
                                    { $eq: [  "$block","1" ] },
                                    { $eq: [ "$blocker_bander", "$$article_id" ] }
                                ] }
                            } }
                          ],
                        
                        as: 'block_live'
                        
                      }
                },
                {
                  $lookup:
                  {
                    from: 'requests_friends',
                    let: {
                        article_id: "$uid",
                        self:"$_id"
                      },
                        pipeline: [
                        { $match: {
                            $expr: { $and: [
                                { $eq: [  "$primary_user","$$self" ] },
                                { $eq: [ "$request_id", "$$article_id" ] }
                            ] }
                        } }
                      ],
                    
                    as: 'confirm'
                    
                  }  
                },
                {
                    $project:
                    {
                        _id:1,
                        FirstName:1,
                        LastName:1,
                        Gender:1,
                        Phone:1,
                        Country:1,
                        Birthday:1,
                        src:1,
                        number:1,
                        state:1,
                        hide_friends:1,
                        hide_gifts:1,
                        hide_status:1,
                        hide_visitors:1,
                        chat_private:1,
                        can_message:1,
                        powers:1,
                        points:1,
                        level:1,
                        coins:1,
                        role:1,
                        ban:1,
                        block:1,
                        vip_shield:1,  
                        Admin_id:1,              
                        friend:{$size:"$friend"},
                        enemy:{$size:"$enemy"},
                        favorites_friends:{$size:"$favorites_friends"},
                        ban_live:{$size:"$ban_live"},
                        block_live:{$size:"$block_live"},
                        request:{$size:"$request"},
                        confirm:{$size:"$confirm"}
                      }
                }
                ,
        
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