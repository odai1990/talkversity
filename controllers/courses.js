const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var courses = mongoose.model('Courses');
var fs = require('fs');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploadsFiles');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  var extenstion = file.originalname.split('.')
  if (extenstion[1].toLocaleLowerCase() === 'jpeg' || extenstion[1].toLocaleLowerCase() === 'jpg' || extenstion[1].toLocaleLowerCase() === 'png' || extenstion[1].toLocaleLowerCase() === 'gif') {
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

router.route('/getcoures').get(function (req, res) {
  courses.find({}, (err, doc) => {
    res.end(JSON.stringify(doc))
  });
});



router.route('/addcours').post(upload.array('image'), function (req, res) {

  var add = new courses();
  add._id = randomstring.generate({
    length: 28,
    charset: 'alphanumeric'
  });
  add.title = req.body.title;
  add.desc = req.body.desc;
  add.pref = req.body.pref;

  add.img1 = "http://localhost:3000/uploadsFiles/" + req.files[0].filename;
  add.img2 = "http://localhost:3000/uploadsFiles/" + req.files[1].filename;
  add.img3 = "http://localhost:3000/uploadsFiles/" + req.files[2].filename;

  add.price = req.body.price;

  add.save((err, doc) => {
    if (err) {
      res.send("Somthing Went Wrong!");
    } else {
      res.send("Has Been Added Successfully");
    }
  });

});


router.route('/deletecoures').delete(function (req, res) {


  courses.findByIdAndDelete({
    "_id": req.query.id
  }, (err, doc) => {
    if (err) {
      res.end(null);
    } else {     
      fs.unlink("public/uploadsFiles" + doc.img1.split('uploadsFiles')[1], function (err) {
        fs.unlink("public/uploadsFiles/" + doc.img2.split('uploadsFiles')[1], function (err) {
          fs.unlink("public/uploadsFiles/" + doc.img3.split('uploadsFiles')[1], function (err) { });
        });
      });
      res.end("Your data has been deleted successfully");
    }
  });
});


module.exports = router;