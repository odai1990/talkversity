const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var live_chats = mongoose.model('Live_Room_Info');
var moment = require('moment');
const jwt = require('jsonwebtoken');
var OpenTok = require('opentok'),
    opentok = new OpenTok("46523142", "3644754898d8ab39a2b6b162b60f47d4a77f653a");
   // opentok = new OpenTok("46516262", "2a4327c94007e23e45f45a5f33f43df6229d1dda");
router.route('/create_room').post(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.user_id )
            {
                
                res.sendStatus(403);
                return;
            }
            

            let self=this;
            opentok.createSession({mediaMode:"routed"}, function(err, session) {
              if (err) return console.log(err);
            
             console.log("dddddddddddddddd:",session)
             var add = new live_chats();
            
             add.room_name = req.body.room_name;
             add.camera_source = req.body.camera_source;
             add.mic_source =req.body.mic_source;
             add.limitations = req.body.limitations;
             add.user_id = req.body.user_id;
             add.messages=[];
             add.gender=req.body.gender;
             add.level=req.body.level;
             add.sesion_id=session.sessionId;
             add.AppID="46523142";
            // add.AppID="46516262";
             add.token=session.generateToken({
                role :                   'moderator',
                expireTime :             (new Date().getTime() / 1000)+( 24 * 60 * 60), // in one week
                data :                   'name=Johnny',
                initialLayoutClassList : ['focus']
              });
             if( req.body.user_id=="")
             {
             add.password ="no password";
             }
             else{
                 add.password = req.body.password; 
             }
           
           
             add.save((err, doc) => {
                 if (err) {
                     res.end("We couldn't save your data please try later!");
                 } else {
                    
                     res.end(JSON.stringify(doc));
                 }
         
         
             });
            });
          
        }
    });

    
  
   

   

});



router.route('/get_users').get(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
           
            if(authData.user.key!=req.query.uid )
            {
                
                res.sendStatus(403);
                return;
            }
            live_chats.aggregate([
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'info'
                      }
                },
                {
                    $lookup:
                    {
                        from: 'vip_shields',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'vip_shield'
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
                            self: "$user_id"
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
                            self: "$user_id"
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
                            self:"$user_id"
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
                        from: 'ban_blocks',
                        let: {
                            article_id: "$uid",
                            self:"$user_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$article_id" ] },
                                    { $eq: [  "$ban","1" ] },
                                    { $eq: [ "$blocker_bander", "$$self" ] }
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
                            self:"$user_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$article_id" ] },
                                    { $eq: [  "$block","1" ] },
                                    { $eq: [ "$blocker_bander", "$$self" ] }
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
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'powers'
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
                        info:1,
                        user_id:1, 
                        room_name:1,
                        camera_source:1,
                        mic_source:1,
                        limitations:1, 
                        powers:1, 
                        vip_shield:1, 
                        messages:1,  
                        level:1,
                        gender:1,
                        password:1, 
                        token:1,
                        AppID:1,
                        sesion_id:1,                          
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
  
router.route('/track_users').get(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
           
            if(authData.user.key!=req.query.uid )
            {
                
                res.sendStatus(403);
                return;
            }
            let Ids=[]
            req.query.Oid.map((item,index)=>
            {
                var r = new RegExp(JSON.parse(item).guid, "i");
                Ids.push(r)

            })
           
          
            live_chats.aggregate([{
                $match:
                {
               // user_id:    { $regex: /hkwezwnwoodkmfxametmqz9htyc2/i }
                //user_id:    { $regex: req.query.Oid, '$options' : 'i' }
               user_id:   {$in:Ids} 
            }},
                {
                    $lookup:
                    {
                        from: 'users',
                        localField: 'user_id',
                        foreignField: '_id',
                        as: 'info'
                      }
                },
                {
                    $lookup:
                    {
                        from: 'vip_shields',
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'vip_shield'
                      }
                },
               
                {
                    $addFields:
                    {
        
                      uid: req.query.uid
                        // uid:"Ya3DNY2aBggosQJjhDm26vTmfWB3"
        
                    }
                },
        
        
                {
                    $lookup:
                    {
                        from: 'friends',
                        let: {
                            article_id: "$uid",
                            self: "$user_id"
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
                            self: "$user_id"
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
                            self:"$user_id"
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
                        from: 'ban_blocks',
                        let: {
                            article_id: "$uid",
                            self:"$user_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$article_id" ] },
                                    { $eq: [  "$ban","1" ] },
                                    { $eq: [ "$blocker_bander", "$$self" ] }
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
                            self:"$user_id"
                          },
                            pipeline: [
                            { $match: {
                                $expr: { $and: [
                                    { $eq: [  "$blocked_banned","$$article_id" ] },
                                    { $eq: [  "$block","1" ] },
                                    { $eq: [ "$blocker_bander", "$$self" ] }
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
                        localField: 'user_id',
                        foreignField: 'user_id',
                        as: 'powers'
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
                        info:1,
                        user_id:1, 
                        room_name:1,
                        camera_source:1,
                        mic_source:1,
                        limitations:1, 
                        powers:1, 
                        vip_shield:1, 
                        messages:1,  
                        level:1,
                        gender:1,
                        password:1, 
                        token:1,
                        AppID:1,
                        sesion_id:1,                          
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
  
   
    router.route('/delete_room').delete(verifyToken,function (req, res) {

        jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
            if(err) {
               
              res.sendStatus(403);
              return;
            } 
            
            else
            {
            //       if(authData.user.key!=req.body.uid )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }

                live_chats.findByIdAndDelete({ '_id': req.body.room_id}, (err, doc) => {
                    res.end("Your room is deleted successfully")
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