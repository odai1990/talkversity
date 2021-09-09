const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');


const multer = require('multer');

const storage = multer.diskStorage({
   
  destination: function(req, file, cb) {
   cb(null, 'public/uploadsFiles');  
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

var randomstring = require("randomstring");



router.route('/signup').post(upload.single('image'),function (req, res) {



    user.findOne({ email: req.body.email },(err, doc) => {
      
        if (err) {
            res.send("node ")
        }else
        {
            if(doc==null)
            {
                addUser(doc)
            }else
            {
                res.send("Invalied Email!")
            }
        }
    })

    function addUser(doc) {

        var add = new user();
        add._id = randomstring.generate({
            length: 28,
            charset: 'alphanumeric'
        });
        add.firstName = req.body.firstName;
        add.lastName = req.body.lastName;
        add.gender = req.body.gender; 
        if(req.file!=null)        
        add.src ="http://localhost:3000/uploadsFiles/"+req.file.filename;        
        else
        add.src=''    
        add.password = req.body.password;
        add.email = req.body.email;
        add.role = 0;
        add.save((err, doc) => {
            if (err) {
                res.send("Somthing Went Wrong!");
            } else {
                res.end(JSON.stringify(doc));           
            }
        });
    }
});


router.route('/login').get(function (req, res) {

    user.findOne({ email: req.query.email, password: req.query.password }, (err, doc) => {
        if (err) {
            res.send("Somthing Went Wrong!");
        } else {
            if(doc==null)
            res.send('Email or Password is InCorrect!');
            else
            res.send(JSON.stringify(doc));
        }

    });





});


module.exports = router;