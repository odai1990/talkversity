const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');
var vip_shield = mongoose.model('Vip_Shield');
var N_u = mongoose.model('UsersN');
var power = mongoose.model('Power');
var moment = require('moment');
var messages = mongoose.model('Messages');
var Temp_User_Login = mongoose.model('Temp_User_Login');
const jwt = require('jsonwebtoken');
var randomstring = require("randomstring");

//----------------------we must delete it
router.get("/", (req, res) => {
    res.json('sample text');
});
//----------------------------------------
router.route('/add_user').post(function (req, res) {

    var add = new user();
    add._id = req.body.id;
    add.FirstName = req.body.FirstName;
    add.LastName = req.body.LastName;
    add.Gender = req.body.Gender;
    add.Phone = req.body.Phone;
    add.Country = req.body.Country;
    add.Birthday = req.body.Birthday;
    add.src = "";
    add.number = req.body.number;
    add.state = "offline";
    add.coins = "3000";
    add.hide_friends ="0";
    add.hide_gifts = "0";
    add.hide_status = "0";
    add.hide_visitors = "0";
    add.chat_private = "All";
    add.can_message = "All";
    add.level="0";
    add.points="0";
    add.role="0";
    add.ban="0";
    add.password=req.body.password;
    add.email=req.body.email;
add.block="0";
add.Admin_id=req.body.Admin_id;
    add.save((err, doc) => {
        if (err) {
            res.end("We couldn't save your data please try later!");
        } else {
            var add_vs = new vip_shield();
            add_vs.user_id = doc._id;
            add_vs.vip = "0";
            add_vs.duration_vip = moment().format().toString();
            add_vs.shield = "0";
            add_vs.duration_shield = moment().format().toString();
            add_vs.save();



            var add_power = new power();
            add_power.user_id = doc._id;
            add_power.protection_active = 0;
            add_power.protection_time = moment().format().toString();
            add_power.protection_name = "";
            add_power.handcuff_active = 0;
            add_power.handcuff_time = moment().format().toString();
            add_power.handcuff_name = "";
            add_power.shoes_active = 0;
            add_power.shoes_time = moment().format().toString();
            add_power.shoes_name = "";
            add_power.cow_active = 0;
            add_power.cow_time = moment().format().toString();
            add_power.cow_name = "";
            add_power.monkey_active = 0;
            add_power.monkey_time = moment().format().toString();
            add_power.monkey_name = "";
            add_power.camera_block_active = 0;
            add_power.camera_block_time = moment().format().toString();
            add_power.camera_block_name = "";
            add_power.donkey_active = 0;
            add_power.donkey_time = moment().format().toString();
            add_power.donkey_name = "";
            add_power.lock_active = 0;
            add_power.lock_time = moment().format().toString();
            add_power.lock_name = "";
            add_power.invisiable_active = 0;
            add_power.invisiable_time = moment().format().toString();
            add_power.invisiable_name = "";
            add_power.save();
            res.end("Your data is added successfully");
            // res.end("Your data is added successfully");
        }


    });


});


router.route('/get_user').get(function (req, res) {

    // user.findOne({_id:req.query.uid},(err,doc)=>
    // {
    //    res.send(JSON.stringify(doc));
    // });


    user.aggregate([
        {
            $lookup:
            {
                from: "vip_shields",
                localField: "_id",
                foreignField: "user_id",
                as: "vip_shield"
            }
        }, {
            $lookup:
            {
                from: "powers",
                localField: "_id",
                foreignField: "user_id",
                as: "powers"
            }
        },
        {
            $match:
            {

                _id: req.query.uid

            }
        },




    ], function (err, result) {
        if (result != "") {
            
  
        res.send(JSON.stringify(result[0]));
        } else {
            res.send(null);
        }

    });



});

router.route('/get_info_token').get(function (req, res) {
    const User=user;
    
       
    
       user.findOne({ $and: [{_id:req.query.user[2]},{FirstName:req.query.user[3]},{LastName:req.query.user[4]},{ Gender:req.query.user[5]},{ password:req.query.user[1]},{ email:req.query.user[0]} ] }, function(err,obj) { 
            
        if(obj!=null)
        {
            const user = {
                email: req.query.user[0],
                    JWT_KEY: "localhost:123456:@#$%^&*NOACCESSHER",
                    password:req.query.user[1],
                    key:req.query.user[2], 
                    FN:req.query.user[3],
                    LN:req.query.user[4],
                    Gender:req.query.user[5]
        
                 
                }
           
                User.findOneAndUpdate({ _id:req.query.user[2] }, {
                    $set: {
                        state: "online"
                       
                    }
                }, { new: true }, (err, doc) => {
                    
                });
              
    
                jwt.sign({user}, "localhost:123456:@#$%^&*NOACCESSHER",{ expiresIn: "1d" }, (err, token) => {
           
            
                 // res.send(token);
               
                    res.send(token);
                
                  
                });
    
        }
        else
    
        {
            res.sendStatus(403);
        }
            
          });
                
        
               
           
    
    
    
    
    
    });

router.route("/update_state").put(function(req,res){
    user.findOneAndUpdate({ _id: req.body.uid }, {
        $set: {
            state: req.body.state,
           
        }
    }, { new: true }, (err, doc) => {
        if(err)
        {
            res.send("node ")
        }else{
            res.end("Your data is updated successfully");
        }
    });

});
router.route("/change_password").put(function(req,res){
    user.findOneAndUpdate({ _id: req.body.uid }, {
        $set: {
            password: req.body.passowrd,
           
        }
    }, { new: true }, (err, doc) => {
        if(err)
        {
            res.send("node ")
        }else{
            res.end("Your data is updated successfully");
        }
    });

});



router.route("/send_email").get(function(req,res){


   let fs = require('fs');

    fs.readFile('./controllers/email.html', function (err, html) {
        if (err) {
            throw err; 
        }       
      // res.end(html)

          user.findOne({ email: req.query.email }, (err, doc) => {
        if(doc==null)
        {
            res.end("This email that you have inserted does not associate with any account !");
        }else{

               const send = require('gmail-send')({
        user: 'egowego@egowego.com',
        pass: 'fpunjaawqaozkiiy',
        to:   req.query.email,
        // user: 'odai22odai78@gmail.com',
        // pass: 'nehudsdaptsyvvhz',
        // to:   'odai22odai78@mail.ru',
        subject: 'Password',
    //    html:    '<b style="color:red">yes  done it</b>'
      html:(html.toString().replace("XXXXXX", "Your Password Is : ")).replace("XXXXXXXX", doc.password)
      });
      
      send({
        text:    'gmail-send example 1',  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
      })
  
//console.log(html.toString())
           res.end("We have sent an email to your email successfully, Please check your email");
        }
    });


    });




   
   

    // const send = require('gmail-send')({
    //     user: 'egowego@egowego.com',
    //     pass: 'fpunjaawqaozkiiy',
    //     to:   'odai22odai78@mail.ru',
    //     // user: 'odai22odai78@gmail.com',
    //     // pass: 'nehudsdaptsyvvhz',
    //     // to:   'odai22odai78@mail.ru',
    //     subject: 'test subject',
    //    html:    '<b style="color:red">yes  done it</b>'
    //   });
      
    //   send({
    //     text:    'gmail-send example 1',  
    //   }, (error, result, fullResult) => {
    //     if (error) console.error(error);
    //     console.log(result);
    //   })
   
    //         res.end("Your data is updated successfully");
   

});
router.route("/receive_email").get(function(req,res){


    let fs = require('fs');

    fs.readFile('./controllers/email.html', function (err, html) {
        if (err) {
            throw err; 
        }       
      // res.end(html)

          user.findOne({ email: req.query.email }, (err, doc) => {
        if(doc==null)
        {
            res.end("This email that you have inserted does not associate with any account !");
        }else{

               const send = require('gmail-send')({
        user: 'egowego@egowego.com',
        pass: 'fpunjaawqaozkiiy',
        to:   "egowego@egowego.com",
        // user: 'odai22odai78@gmail.com',
        // pass: 'nehudsdaptsyvvhz',
        // to:   'odai22odai78@mail.ru',
        subject: 'Password Problem',
    //    html:    '<b style="color:red">yes  done it</b>'
      html:(html.toString().replace("XXXXXX", "This user can't access his email "+req.query.email)).replace("XXXXXXXX","His Paswword Is : "+ doc.password)
      });
      
      send({
        text:    'gmail-send example 1',  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
      })
  
//console.log(html.toString())
           res.end("We have sent an email to your email successfully, Please check your email");
        }
    });


    });



   
   

    // const send = require('gmail-send')({
    //     user: 'egowego@egowego.com',
    //     pass: 'fpunjaawqaozkiiy',
    //     to:   'odai22odai78@mail.ru',
    //     // user: 'odai22odai78@gmail.com',
    //     // pass: 'nehudsdaptsyvvhz',
    //     // to:   'odai22odai78@mail.ru',
    //     subject: 'test subject',
    //    html:    '<b style="color:red">yes  done it</b>'
    //   });
      
    //   send({
    //     text:    'gmail-send example 1',  
    //   }, (error, result, fullResult) => {
    //     if (error) console.error(error);
    //     console.log(result);
    //   })
   
    //         res.end("Your data is updated successfully");
   

});
router.route("/reactus_email").get(function(req,res){

      

    let fs = require('fs');

    fs.readFile('./controllers/email.html', function (err, html) {
        if (err) {
            throw err; 
        }       
      // res.end(html)

     
               const send = require('gmail-send')({
        user: 'egowego@egowego.com',
        pass: 'fpunjaawqaozkiiy',
        to:   "egowego@egowego.com",
        // user: 'odai22odai78@gmail.com',
        // pass: 'nehudsdaptsyvvhz',
        // to:   'odai22odai78@mail.ru',
        subject: req.query.topic,
    //    html:    '<b style="color:red">yes  done it</b>'
      html:(html.toString().replace("XXXXXX", req.query.topic+ " <br/><h6>"+req.query.email+"<h6/>")).replace("XXXXXXXX", req.query.problem)
      });
      
      send({
        text:    'gmail-send example 1',  
      }, (error, result, fullResult) => {
        if (error) console.error(error);
        console.log(result);
      })
  
//console.log(html.toString())
           res.end("We have sent an email to your email successfully, Please check your email");
       
 


    });





     
   
   

    // const send = require('gmail-send')({
    //     user: 'egowego@egowego.com',
    //     pass: 'fpunjaawqaozkiiy',
    //     to:   'odai22odai78@mail.ru',
    //     // user: 'odai22odai78@gmail.com',
    //     // pass: 'nehudsdaptsyvvhz',
    //     // to:   'odai22odai78@mail.ru',
    //     subject: 'test subject',
    //    html:    '<b style="color:red">yes  done it</b>'
    //   });
      
    //   send({
    //     text:    'gmail-send example 1',  
    //   }, (error, result, fullResult) => {
    //     if (error) console.error(error);
    //     console.log(result);
    //   })
   
    //         res.end("Your data is updated successfully");
   

});



router.route('/add_user_Local').post(function (req, res) {


// var add = new N_u()
// add.Admin_number=1;
// add.Profile_number=2;
// add.save()
// res.send("node ")

N_u.findOneAndUpdate({ }, {
   
        // Admin_number: parseInt(Admin_number)+1,
        // Profile_number:parseInt(Profile_number)+1

         $inc: { Admin_number: +1, Profile_number: +1 } 
 
}, { new: true }, (err, doc) => {
    if(err)
    {
        res.send("node ")
    }else{
        
        addUser(doc)
    }
})

function addUser(doc)
{

   ;
    var add = new user();
    add._id =  randomstring.generate({
        length: 28,
        charset: 'alphanumeric'
      });
    add.FirstName = req.body.FirstName;
    add.LastName = req.body.LastName;
    add.Gender = req.body.Gender;
   
    add.Country = req.body.Country;
    add.Birthday = req.body.Birthday;
    add.src = "";

    add.number = doc.Profile_number;

    add.state = "offline";
    add.coins = "3000";
    add.hide_friends ="0";
    add.hide_gifts = "0";
    add.hide_status = "0";
    add.hide_visitors = "0";
    add.chat_private = "All";
    add.can_message = "All";
    add.level="0";
    add.points="0";
    add.role="0";
    add.ban="0";
    add.password=req.body.password;
    add.email=req.body.email;
add.block="0";

add.Admin_id=doc.Admin_number;

    add.save((err, doc) => {
        if (err) {
            res.end("We couldn't save your data please try later!");
        } else {
            var add_vs = new vip_shield();
            add_vs.user_id = doc._id;
            add_vs.vip = "0";
            add_vs.duration_vip = moment().format().toString();
            add_vs.shield = "0";
            add_vs.duration_shield = moment().format().toString();
            add_vs.save();



            var add_power = new power();
            add_power.user_id = doc._id;
            add_power.protection_active = 0;
            add_power.protection_time = moment().format().toString();
            add_power.protection_name = "";
            add_power.handcuff_active = 0;
            add_power.handcuff_time = moment().format().toString();
            add_power.handcuff_name = "";
            add_power.shoes_active = 0;
            add_power.shoes_time = moment().format().toString();
            add_power.shoes_name = "";
            add_power.cow_active = 0;
            add_power.cow_time = moment().format().toString();
            add_power.cow_name = "";
            add_power.monkey_active = 0;
            add_power.monkey_time = moment().format().toString();
            add_power.monkey_name = "";
            add_power.camera_block_active = 0;
            add_power.camera_block_time = moment().format().toString();
            add_power.camera_block_name = "";
            add_power.donkey_active = 0;
            add_power.donkey_time = moment().format().toString();
            add_power.donkey_name = "";
            add_power.lock_active = 0;
            add_power.lock_time = moment().format().toString();
            add_power.lock_name = "";
            add_power.invisiable_active = 0;
            add_power.invisiable_time = moment().format().toString();
            add_power.invisiable_name = "";
            add_power.save();
            res.end("Your data is added successfully");
            // res.end("Your data is added successfully");
        }


    });

}
});


router.route('/add_user_Local_Facebook').post(function (req, res) {

  
    

    
    user.findOne({email:req.body.data.email},(err,doc)=>
    {
        if(err)
        {
       
            res.send("No");
        }else if(doc!=null)
        {
            console.log("No1")
            res.send(JSON.stringify(doc));
     
        }else{
        
          number(req.body.data)
           // res.send(JSON.stringify(doc));
        }
      
    });


 
    
    function addUser(doc,data)
    {
        let temp=data.birthday.split('/')
      
        var add = new user();
        add._id =  randomstring.generate({
            length: 28,
            charset: 'alphanumeric'
          });
        add.FirstName = data.first_name;
        add.LastName =data.last_name;
        add.Gender = data.gender;
       
        add.Country ="FaceBook";
        add.Birthday = temp[2]+"-"+temp[0]+"-"+temp[1];
        add.src = data.picture.data.url;
    
        add.number = doc.Profile_number;
    
        add.state = "offline";
        add.coins = "3000";
        add.hide_friends ="0";
        add.hide_gifts = "0";
        add.hide_status = "0";
        add.hide_visitors = "0";
        add.chat_private = "All";
        add.can_message = "All";
        add.level="0";
        add.points="0";
        add.role="0";
        add.ban="0";
        add.password= randomstring.generate({
            length: 10,
            charset: 'alphanumeric'
          });;
        add.email=data.email;
    add.block="0";
    
    add.Admin_id=doc.Admin_number;
    
        add.save((err, doc) => {
            if (err) {
                res.end("We couldn't save your data please try later!");
            } else {
                var add_vs = new vip_shield();
                add_vs.user_id = doc._id;
                add_vs.vip = "0";
                add_vs.duration_vip = moment().format().toString();
                add_vs.shield = "0";
                add_vs.duration_shield = moment().format().toString();
                add_vs.save();
    
    
    
                var add_power = new power();
                add_power.user_id = doc._id;
                add_power.protection_active = 0;
                add_power.protection_time = moment().format().toString();
                add_power.protection_name = "";
                add_power.handcuff_active = 0;
                add_power.handcuff_time = moment().format().toString();
                add_power.handcuff_name = "";
                add_power.shoes_active = 0;
                add_power.shoes_time = moment().format().toString();
                add_power.shoes_name = "";
                add_power.cow_active = 0;
                add_power.cow_time = moment().format().toString();
                add_power.cow_name = "";
                add_power.monkey_active = 0;
                add_power.monkey_time = moment().format().toString();
                add_power.monkey_name = "";
                add_power.camera_block_active = 0;
                add_power.camera_block_time = moment().format().toString();
                add_power.camera_block_name = "";
                add_power.donkey_active = 0;
                add_power.donkey_time = moment().format().toString();
                add_power.donkey_name = "";
                add_power.lock_active = 0;
                add_power.lock_time = moment().format().toString();
                add_power.lock_name = "";
                add_power.invisiable_active = 0;
                add_power.invisiable_time = moment().format().toString();
                add_power.invisiable_name = "";
                add_power.save();



                var message = new messages();
            
                message.sender_id = "JIacKQATTdfd1109XZpwnvOYqFX2";
                message.res_id = doc._id;
                message.mess = "You can login with your email insted of FACEBOOK *if you want* with your email and your password is : "+doc.password;
                message.date=moment().format("YYYY/MM/DD");
              
                message.save((err, doc) => {
                 
            
                });

                res.end(JSON.stringify(doc));
                // res.end("Your data is added successfully");
            }
    
    
        });
    
    }
    function number(data)
    {
      
        N_u.findOneAndUpdate({ }, {
       
         
             $inc: { Admin_number: +1, Profile_number: +1 } 
     
    }, { new: true }, (err, doc) => {
        if(err)
        {
            res.send("node ")
        }else{
            
            addUser(doc,data)
        }
    })
    }
    });
router.route('/Login_user').get(function (req, res) {

    user.findOne({email:req.query.email,password:req.query.password},(err,doc)=>
    {
        if(err)
        {
            res.send("No");
        }else
        {
            res.send(JSON.stringify(doc));
        }
      
    });


   


});
//app.post('/api/login', (req, res) => {
    //     // Mock user
    //     const user = {
    //         MONGO_ATLAS_PW: "CTdYB4jqX6uovW7O",
    //         JWT_KEY: "localhost:123456:@#$%^&*NOACCESSHER"
    //     }
    
    //     jwt.sign({user}, "localhost:123456:@#$%^&*NOACCESSHER", (err, token) => {
    //       res.json({
    //         token
    //       });
    //     });
    //   });


module.exports = router;