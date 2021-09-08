const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var admingift = mongoose.model('AdminGift');

const jwt = require('jsonwebtoken');


router.get("/get_admingift",verifyToken, (req, res) => {
     
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            admingift.find({type:{"$regex":req.query.type}}, (err, doc) => {
               
                            res.end( JSON.stringify(doc))
                           
            })
        }
      });
     


     
    
});









router.route('/post_admingift').post(verifyToken,function (req, res) {
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            var add = new admingift();
            
            add.point = req.body.point;
            add.type = req.body.type;
            add.price = req.body.price;
            add.src = req.body.src;
          
          
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                } else {
                   
                    res.end("Your data is added successfully");
                }
        
                            
            })
        }
      });
      



});








router.route('/delete_admingift').delete(verifyToken,function (req, res) {
  
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            res.end("not works yet, wait dashboard");
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