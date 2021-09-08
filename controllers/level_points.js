const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var level_points = mongoose.model('Level_Point');
const jwt = require('jsonwebtoken');


router.route('/post_level_points').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
            var add = new level_points();
        
            add.level = req.body.level;
            add.points = req.body.points;
        
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


router.route('/get_level_points').get(verifyToken,function (req, res) {


    // jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    //     if(err) {
           
    //       res.sendStatus(403);
    //       return;
    //     } else
    //     {
            
            level_points.aggregate([
                {
                    $match:
                    {
                        $and: [{ points: { $lte: parseInt(req.query.points) } }]
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
        
                if (result != "") {
                    res.send(JSON.stringify(result));
                } else {
                    res.send(null);
                }
        
            });
    //     }
    // });
    




});



router.route('/get_next_level_points').get(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
            level_points.aggregate([
                {
                    $match:
                    {
                        $and: [{ points: { $gte: parseInt(req.query.points) } }]
                    }
                },
                {
        
                    $group:
                    {
                        _id: 0,
                        level: { $first: "$level" },
                        poins: { $first: "$points" },
        
                    }
                }
        
        
        
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

// router.route('/progress_bar').get(verifyToken,function (req, res) {
router.route('/progress_bar').get(function (req, res) {

    // jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    //     if(err) {
           
    //       res.sendStatus(403);
    //       return;
    //     } else
    //     {
            level_points.aggregate([
                {
                    $match:
                    {
                        $and: [{ points: { $lte: parseInt(req.query.points) } }]
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
                if (result != "") {
                  
                    level_points.findOne({ "level": result[0].level + 1 }, (err, doc) => {
                 
                        if(doc==null)
                        {
                        res.send(JSON.stringify({progress:100}));
                        }else
                        {
                          
                        res.send(JSON.stringify({progress:((req.query.points-parseInt(result[0].poins))/(doc.points-parseInt(result[0].poins)))*100}));
                        }
                    });
                } else {
                    res.send(null);
                }
                //Math.ceil
            });
    //     }
    // });

    

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