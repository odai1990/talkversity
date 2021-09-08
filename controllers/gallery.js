const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var Gallery = mongoose.model('Gallery');
var comment = mongoose.model('Comment');
var moment = require('moment');
var fs = require('fs');
const jwt = require('jsonwebtoken');


const multer = require('multer');

const storage = multer.diskStorage({
   
  destination: function(req, file, cb) {
   cb(null, '/var/www/html/egowego/chat/uploads_images/');  
  },
 
  
  filename: function(req, file, cb) {


    cb(null,  Date.now()+file.originalname);
  }
});

const fileFilter = (req, file, cb) => {

    var extenstion=file.originalname.split('.')
  if(extenstion[1].toLocaleLowerCase()==='jpeg' || extenstion[1].toLocaleLowerCase()==='jpg' || extenstion[1].toLocaleLowerCase()==='png' || extenstion[1].toLocaleLowerCase()==='gif' ){
 
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









const storage2 = multer.diskStorage({
   
  destination: function(req, file, cb) {
   cb(null, '/var/www/html/egowego/chat/uploads_images/');  
  },
 
  
  filename: function(req, file, cb) {


    cb(null,  Date.now()+file.originalname);
  }
});

const fileFilter2 = (req, file, cb) => {

    var extenstion=file.originalname.split('.')
  if(extenstion[1].toLocaleLowerCase()==='webm' ||extenstion[1].toLocaleLowerCase()==='mp4'  ){
 
   cb(null, true);
    
  } else {
    
    cb(null, false);
   
  }
};

const upload2 = multer({
  storage: storage2,
  limits: {
    fileSize: 1024 * 1024 * 30
  },
  fileFilter: fileFilter2
});


router.route('/post_image').post(upload.single('image'),verifyToken,  function (req, res) {
 

  
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
    if(req.file!=null)
    {
     var add = new Gallery();
     
      add.user_id = req.body.user_id;
      add.src ="http://52.34.227.253/egowego/chat/uploads_images/"+req.file.filename ;
      add.name =req.file.filename ;
    add.type="image"
    
    
     add.save((err, doc) => {
         if (err) {
             res.end("We couldn't save your data please try later!");
         } else {
            
             res.end("Your data is added successfully");
         }
    
    
     });
    }
    else
    {
     res.end("You should use these extensions pmg,gif,jep for images");
    }
  }
});




   

});




router.route('/post_video').post(upload2.single('image'),verifyToken,  function (req, res) {

  
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
    if(req.file!=null)
    {
     var add = new Gallery();
     
      add.user_id = req.body.user_id;
      add.src ="http://52.34.227.253/egowego/chat/uploads_images/"+req.file.filename ;
     add.type ="video" ;
     add.name =req.file.filename ;
    
     add.save((err, doc) => {
         if (err) {
             res.end("We couldn't save your data please try later!");
         } else {
            
             res.end("Your data is added successfully");
         }
    
    
     });
    }
    else
    {
     res.end("You should use these extensions webm,mp4 ");
    }
  }
});


 
 

  

});

router.route('/get_images').get(verifyToken, function (req, res) {

  
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
  if(err) {
     
    res.sendStatus(403);
    return;
  } else
  {
    // if(authData.user.key!=req.query.user_id)
    // {
        
    //     res.sendStatus(403);
    //     return;
    // }
    Gallery.find({$and: [ {user_id:req.query.user_id}, { type:req.query.type}]},(err,doc)=>{
        
            
            res.send(doc);
        }
          
    );
  }
});






});



router.route('/delete_images').delete(verifyToken, function (req, res) {


  
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
  if(err) {
     
    res.sendStatus(403);
    return;
  } else
  {
    
    
    req.body.f.forEach(function (element) {
    Gallery.findByIdAndDelete({ '_id': element }, (err, doc) => {
      comment.find({"picture_id": element },(err,doc)=>{
        if (err) {
            res.end(null);
        } else {
          doc.forEach( function (doc) {
            doc.remove();
          });
        
         
        }
      }          
      );
    fs.unlink("/var/www/html/egowego/chat/uploads_images/"+doc.name,function(err){
    
    });
    
     });
     res.end("Your data is deleted successfully");
    });
  }
});





});

router.route('/delete_comment').delete(verifyToken, function (req, res) {
    

  
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
  if(err) {
     
    res.sendStatus(403);
    return;
  } else
  {
    comment.findByIdAndDelete({"_id": req.body.cid },(err,doc)=>{
      if (err) {
          res.end(null);
      } else {
         
          res.end("Your data is deleted successfully");
      }
    }          
    );
  }
});


});




router.route('/post_comment').post(verifyToken, function (req, res) {
    

  
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
  if(err) {
     
    res.sendStatus(403);
    return;
  } else
  {
    var add = new comment();
      
       add.picture_id = req.body.picture_id;
       add.user_id =req.body.user_id ;
       add.comment=req.body.comment;
       add.date=moment().format("YYYYMMDDhhmmss");
     
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







router.route('/get_comment').get(verifyToken, function (req, res) {

  
jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
  if(err) {
     
    res.sendStatus(403);
    return;
  } else
  {
    comment.aggregate([
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
          $match:
          {
            picture_id:req.query.picture_id
          }
      },  
      {
          $group:
          {
            _id: 0,
            commants:{$push:{$concatArrays:["$info",['$comment'],['$date'],[
           "$_id"
         ]]}}
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