const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var enemies = mongoose.model('Enemies');

const jwt = require('jsonwebtoken');


router.get("/get_enemies",verifyToken, (req, res) => {
     
    
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {
        // if(authData.user.key!=req.query.user_id)
        //     {
                
        //         res.sendStatus(403);
        //         return;
        //     }
        enemies.aggregate([
            {
                $lookup:
                {
                    from: "users",
                    localField: "enemy_id",
                    foreignField: "_id",
                    as: "enemies"
                }
            },
            {
                $match:
                {
                    user_id:req.query.user_id
                }
            },
            
            {
                $unwind:
                {
                    path: "$enemies",
                    includeArrayIndex: '0',
                     
                    preserveNullAndEmptyArrays: true
                  }
            },
          
            {
                $group:
                {
                '_id': 0,
                        'enemies': { $push: "$enemies" },
                       
                }
            },
            {
                $project:
                {
                    _id:0,
                    enemies:1
                }
            }
            ,
           
        ], function (err, result) {
            if(result!="")
          {
            res.send(JSON.stringify(result[0]['enemies']));
          }else
          {
          res.send(null);
          }
          
        });
    }
  });
  

    
});









router.route('/post_enemies').post(verifyToken,function (req, res) {
    
   
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {

        if(authData.user.key!=req.body.user_id)
            {
                
                res.sendStatus(403);
                return;
            }
        enemies.find({ user_id: req.body.user_id, enemy_id: req.body.enemy_id }, (err, doc) => {
            if (doc == "") {
                var add = new enemies();
      
                add.user_id = req.body.user_id;
                add.enemy_id = req.body.enemy_id;
      
                add.save((err, doc) => {
                    if (err) {
                        res.end("We couldn't save your data please try later!");
                    } else {
                        res.end("Your data is added successfully");
                    }
      
      
                    });
                }else
                    {
                        res.end("This user is already in enemies list !")
                    }
        });
    }
  });
  



});








router.route('/delete_enemies').delete(verifyToken,function (req, res) {
  


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.user_id)
            {
                
                res.sendStatus(403);
                return;
            }
            enemies.findOneAndDelete({user_id:req.body.user_id,enemy_id:req.body.enemy_id},(err,doc)=>{
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