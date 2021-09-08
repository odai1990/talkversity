const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Temp_User_Login = mongoose.model('Temp_User_Login');

const jwt = require('jsonwebtoken');



router.get("/user_info",verifyToken, (req, res) => {
    
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
                Temp_User_Login.findOne({ uis:req.body.uid }, (err, doc) => {
                  
                  
                    res.send(JSON.stringify(doc));
               
            })
        }
    });
    
   

});

router.delete("/user_info",verifyToken, (req, res) => {
   

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            ban_block.findOne({ uis:req.body.uid }, (err, doc) => {
              
                    ban_block.findOneAndUpdate({ $and: [{ blocker_bander: req.body.blocker_bander }, { blocked_banned: req.body.blocked_banned }] }, { $set: { block: req.body.block, ban: req.body.ban } }, { new: true }, (err, doc) => {
        
                    });
                    res.end("This user is addded successfully");
               
            })
        }
    });
    


});

router.post("/user_info", verifyToken,(req, res) => {
   
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            var add = new Temp_User_Login();
               add.uid=req.body.uid;
               add.first_name = req.body.First_Name;
               add.last_name = req.body.Last_Name;
             
             
               add.save();
           
            res.send("Is add successfully");
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