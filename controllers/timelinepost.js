const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var CommentReply = mongoose.model('CommentReply');
var CommentP = mongoose.model('CommentP');
var Post = mongoose.model('Post');
var Treasure = mongoose.model('Treasure');
var fs = require('fs');
const multer = require('multer');




const jwt = require('jsonwebtoken');

const storage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, '/var/www/html/egowego/chat/uploads_images/');  
        //cb(null, 'C:/Users/Odai/Desktop/EgoWego/src/uploads');


    },


    filename: function (req, file, cb) {


        cb(null, "post" + Date.now() + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {

    var extenstion = file.originalname.split('.')
    if (extenstion[1].toLocaleLowerCase() === 'jpeg' || extenstion[1].toLocaleLowerCase() === 'jpg' || extenstion[1].toLocaleLowerCase() === 'png' || extenstion[1].toLocaleLowerCase() === 'gif' || extenstion[1].toLocaleLowerCase() === 'webm' || extenstion[1].toLocaleLowerCase() === 'mp4') {

        cb(null, true);

    } else {

        cb(null, false);

    }




};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 30
    },
    fileFilter: fileFilter
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


router.get("/get_posts",verifyToken,  (req, res) => {
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.query.uid)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            Post.aggregate([
                {
                    "$match": {
        
                        "$or": [{ "user_id": req.query.uid }, { "user_id": "1" }]
                    }
                },
                {
                    "$addFields": {
                        "Id": {
                            "$toString": "$_id"
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "commentps",
                        "localField": "Id",
                        "foreignField": "post_id",
                        "as": "comments"
                    }
                },
                {
                    "$addFields": {
                        "id_commenter": "$comments.id_commenter",
                        "id_comments": "$comments._id"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "id_commenter",
                        "foreignField": "_id",
                        "as": "comments_users"
                    }
                },
                {
                    "$addFields": {
                        "id_comments": {
                            "$map": {
                                "input": "$id_comments",
                                "as": "grade",
                                "in": {
                                    "$toString": "$$grade"
                                }
                            }
                        }
                    }
                },
                {
                    "$lookup": {
                        "from": "commentreplies",
                        "localField": "id_comments",
                        "foreignField": "comment_id",
                        "as": "replies"
                    }
                },
                {
                    "$addFields": {
                        "id_repliers": "$replies.id_replier"
                    }
                },
                {
                    "$lookup": {
                        "from": "users",
                        "localField": "id_repliers",
                        "foreignField": "_id",
                        "as": "repliers_users"
                    }
                },
                {
                    "$project": {
                        "_id": 1.0,
                        "user_id": 1.0,
                        "Admin_treasure_post": 1.0,
                        "message_post": 1.0,
                        "image_post": 1.0,
                        "video_post": 1.0,
                        "time_post": 1.0,
                        "like_post": 1.0,
                        "dislike_post": 1.0,
                        "seeit_post": 1.0,
                        "type_post": 1.0,
                        "cancled": 1.0,
                        "comments_users": {
                            "$reverseArray": "$comments_users"
                        },
                        "replies": 1.0,
                        "repliers_users": 1.0,
                        "comments": {
                            "$reverseArray": "$comments"
                        }
                    }
                } ,
                
                { 
                    "$sort" : {
                        "_id" : -1.0
                    }
                },
                { 
                    "$skip" : parseInt(req.query.skip)
                }, 
                { 
                    "$limit" : 5.0
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

router.route('/post_post').post(upload.array('image'),verifyToken, function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(req.body.user_id!=1)
               {
                
            if(authData.user.key!=req.body.user_id)
            {
                         
              
              
                res.sendStatus(403);
                return;
            }
        }else{
            if(authData.user.key!=req.body.admin)
            {
            
                res.sendStatus(403);
                return;
            }
        }
            var add = new Post();
        
            add.user_id = req.body.user_id;
            add.message_post = req.body.message_post;
            add.time_post = req.body.time_post;
            add.like_post = req.body.like_post;
            add.dislike_post = req.body.dislike_post;
            add.seeit_post = req.body.seeit_post;
            add.cancled = false;
        
        
            if (req.files.length >0) {
        
                var extenstion = req.files[0].filename.split('.')
                if (extenstion[1].toLocaleLowerCase() === 'jpeg' || extenstion[1].toLocaleLowerCase() === 'jpg' || extenstion[1].toLocaleLowerCase() === 'png' || extenstion[1].toLocaleLowerCase() === 'gif') {
        
                    add.image_post = "http://52.34.227.253/egowego/chat/uploads_images/" + req.files[0].filename;
                    if(req.files.length>1)
                    {
                        add.Admin_treasure_post="http://52.34.227.253/egowego/chat/uploads_images/" + req.files[1].filename;
                    }else{
                        add.Admin_treasure_post=""
                    }
        
                
                    add.video_post = "";
                    add.type_post = "image";
        
        
        
                } else if (extenstion[1].toLocaleLowerCase() === 'webm' || extenstion[1].toLocaleLowerCase() === 'mp4') {
                    if(req.files.length>1)
                    {
                        add.Admin_treasure_post="http://52.34.227.253/egowego/chat/uploads_images/" + req.files[1].filename;
                    }else{
                        add.Admin_treasure_post=""
                    }
                    add.image_post = "";
                    add.video_post = "http://52.34.227.253/egowego/chat/uploads_images/" + req.files[0].filename;
                    add.type_post = "video";
                }
        
        
        
        
        
        
            }
            else {
        
                add.image_post = "";
                if(req.files.length>1)
                {
                    add.Admin_treasure_post="http://52.34.227.253/egowego/chat/uploads_images/" + req.files[1].filename;
                }else{
                    add.Admin_treasure_post=""
                }
                add.video_post = "";
                add.type_post = "";
            }
        
        
        
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                }
                else {
                    res.end(JSON.stringify(doc));
                }
        
        
            });

        }
      });


   

});



router.route('/post_comment').post(verifyToken,function (req, res) {
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.id_commenter)
            {
                
                res.sendStatus(403);
                return;
            }
            



            
            var add = new CommentP();
        
            add.post_id = req.body.post_id;
            add.message_comment = req.body.message_comment;
            add.time_comment = req.body.time_comment;
            add.like_comment = req.body.like_comment;
            add.id_commenter = req.body.id_commenter;
        
        
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                } else {
                    res.end(JSON.stringify(doc));
                }
        
        
            });
        }
    });





});


router.route('/post_reply').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {

            if(authData.user.key!=req.body.id_replier)
            {
                
                res.sendStatus(403);
                return;
            }
            var add = new CommentReply();
        
            add.comment_id = req.body.comment_id;
            add.message_comment_reply = req.body.message_comment_reply;
            add.time_comment_reply = req.body.time_comment_reply;
            add.like_comment_reply = req.body.like_comment_reply;
            add.id_replier = req.body.id_replier;
            add.post_id = req.body.post_id;
        
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                } else {
                    res.end(JSON.stringify(doc));
                }
        
        
            });
        }
    });




});



router.route('/post_treasure').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            var add = new Treasure();
        
            add.image_treasure = req.body.image_treasure;
            add.src_user = req.body.src_user;
            add.gender_user = req.body.gender_user;
            add.fn_user = req.body.fn_user;
            add.ln_user = req.body.ln_user;
            add.date = req.body.date;
            add.id_user = req.body.id_user;
            add.video_post = req.body.video_post;
            add.message_post = req.body.message_post;
            add.image_post = req.body.image_post;
            add.type_post = req.body.type_post;
            add.message_comment = req.body.message_comment;
        
            add.save((err, doc) => {
                if (err) {
                    res.end("We couldn't save your data please try later!");
                } else {
        
        
                    Post.findOneAndUpdate({ _id: req.body.post_id }, {
                        $set: {
                            cancled: true,
                           
                        }
                    }, { new: true }, (err, doc) => {
                       
                    });
        
        
                    res.end(JSON.stringify(doc));
                }
        
        
            });
        }
    });




});
router.route('/get_treasure').get(verifyToken,function (req, res) {
   
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            Treasure.aggregate([
                { 
                    "$sort" : {
                        "_id" : -1.0
                    }
                }, 
                { 
                    "$limit" : 3.0
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


router.route('/delete_treasure').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            Treasure.findOneAndDelete({_id: req.body._id}, (err, doc) => {
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

router.route('/delete_reply').post(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            CommentReply.findOneAndDelete({_id: req.body._id}, (err, doc) => {
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

router.route('/delete_comment').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            CommentP.findOneAndDelete({_id: req.body._id}, (err, doc) => {
                if (err) {
                    res.end("We couldn't delete your data, please try later!");
                } else {
        
        
                    CommentReply.deleteMany({comment_id: req.body._id}, (err, doc) => {
                        
                    }
                    );
        
        
                    res.end("Your data is deleted successfully");
                }
            }
            );
        }
    });
   



});


router.route('/delete_post').post(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            Post.findOneAndDelete({_id: req.body._id}, (err, doc) => {
                if (err) {
                    res.end("We couldn't delete your data, please try later!");
                } else {
        
        
                    CommentP.deleteMany({post_id: req.body._id}, (err, doc) => {
                       
                        
                        CommentReply.deleteMany({post_id: req.body._id}, (err, doc) => {
                       
                       
        
        
                        }
                        );
        
                    }
                    );
        
        
                    res.end("Your data is deleted successfully");
                }
            }
            );
        }
    });
   



});



module.exports = router;