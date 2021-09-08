const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');

var messages = mongoose.model('Messages');



const jwt = require('jsonwebtoken');
var fs = require('fs');



const multer = require('multer');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, '/var/www/html/egowego/chat/uploads_images/users_images/');
    },


    filename: function (req, file, cb) {


        cb(null, Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    var extenstion = file.originalname.split('.')
    if (extenstion[1].toLocaleLowerCase() === 'jpeg' || extenstion[1].toLocaleLowerCase() === 'jpg' || extenstion[1].toLocaleLowerCase() === 'png' ) {

        cb(null, true);

    } else {

       cb(null, false);
      

    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 6
    },
    fileFilter: fileFilter
});


router.route('/update_user_info').put(upload.single('image'), verifyToken,function (req, res) {

    
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {
        if(authData.user.key!=req.body.uid)
        {
            
            res.sendStatus(403);
            return;
        }
        if (req.file != null) {
            user.findOne({ _id: req.body.uid }, {
                
            },(err, doc) => {
        
            });
        
            user.findOneAndUpdate({ _id: req.body.uid }, {
                $set: {
                    src: "http://52.34.227.253/egowego/chat/uploads_images/users_images/" +
                        req.file.filename
                }
            }, { new: true }, (err, doc) => {
        
            });
        
            
        
        
        }
        
        
        if(req.body.firstname !="" && req.body.lastname !="")
        {
        user.findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                 FirstName: req.body.firstname, LastName: req.body.lastname
            }
        }, { new: true }, (err, doc) => {
        
        });
        
        
        }
        
        res.end("Your data is updated successfully");
    }
});

});



router.route('/delete_messeges').delete(verifyToken,function (req, res) {


    
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {
        if(authData.user.key!= req.body.res_id )
        {
            
            res.sendStatus(403);
            return;
        }
        messages.find({ res_id: req.body.res_id }, (err, doc) => {
            if (err) {
                res.end(null);
            } else {
                doc.forEach(function (doc) {
                    doc.remove();
                });
        
        
            }
        
        
        });
        res.end("All your messages is deleted successfully");
    }
});


});

router.route('/get_privacy').get(verifyToken,function (req, res) {


    
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {
        if(authData.user.key!= req.query.uid )
        {
            
            res.sendStatus(403);
            return;
        }
        user.aggregate([
            {
                $match:
                {
                    _id: req.query.uid
                }
            }
            ,
            {
                $project:
                {
                    hide_friends: 1,
                    hide_gifts: 1,
                    hide_status: 1,
                    hide_visitors: 1,
                    chat_private: 1,
                    can_message: 1
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

router.route('/modify_privacy').put(verifyToken,function (req, res) {


    
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
    if(err) {
       
      res.sendStatus(403);
      return;
    } else
    {
        if(authData.user.key!= req.body.uid )
        {
            
            res.sendStatus(403);
            return;
        }
        user.findOneAndUpdate({ _id: req.body.uid }, {
            $set: {
                hide_friends: req.body.hide_friends,
                hide_gifts: req.body.hide_gifts,
                hide_status: req.body.hide_status,
                // hide_visitors: req.body.hide_visitors,
                // chat_private: req.body.chat_private,
                // can_message: req.body.can_message
            }
        }, { new: true }, (err, doc) => {
            if(err)
            {
                res.send("node ")
            }else{
                res.end("Your data is updated successfully");
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