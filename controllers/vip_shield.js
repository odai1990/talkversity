const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');
var vip_shield = mongoose.model('Vip_Shield');
var conis_recevier = mongoose.model('Conis_recevier');
var moment = require('moment');
var countdown = require('moment-countdown');

const jwt = require('jsonwebtoken');

router.route('/buy_vip').put(verifyToken,function (req, res) {

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
            let coinse = req.body.coins;
            let vip = req.body.vip;
            let result = coinse - vip;
        
            if (parseInt(result) >= parseInt(0)) {
                var coins = req.body.coins - req.body.vip;
                user.findOneAndUpdate({ _id: req.body.uid }, { $set: { coins: coins } }, { new: true }, (err, doc) => {
                    if (req.body.current_date == "0") {
                        vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { vip: "1", duration_vip: moment().add(req.body.date, 'days').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
                    else {
                        vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { vip: "1", duration_vip: moment(req.body.current_date).add(req.body.date, 'days').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
        
                });
        
        
                res.send("VIP")
            } else {
                res.send("You don't have enough money")
            }

        }    
    });    





});



router.route('/send_vid').put(verifyToken,function (req, res) {
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
            let coinse = req.body.coins;
            let vip = req.body.vip;
            let result = coinse - vip;
        
        
            if (parseInt(result) >= parseInt(0)) {
                var coins = req.body.coins - req.body.vip;
                user.findOneAndUpdate({ _id: req.body.uid }, { $set: { coins: coins } }, { new: true }, (err, doc) => {
                    vip_shield.findOne({user_id:req.body.id},(err,doc)=>
            {
                if (doc.duration_vip == "0") {
                    vip_shield.findOneAndUpdate({ user_id: req.body.id }, { $set: { vip: "1", duration_vip: moment().add(req.body.date, 'days').format().toString() } }, { new: true }, (err, doc) => {
                       
                    });
                }
                else {
                    vip_shield.findOneAndUpdate({ user_id: req.body.id }, { $set: { vip: "1", duration_vip: moment(doc.duration_vip).add(req.body.date, 'days').format().toString() } }, { new: true }, (err, doc) => {
                       
                    });
                }
            });
                    
        
        
                });
        
        
                res.send("done")
            } else {
                res.send("You don't have enough money")
            }
        }
    });

    



    




});


router.route('/buy_shield').put(verifyToken,function (req, res) {


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
            let coinse = req.body.coins;
            let shield = req.body.shield;
            let result = coinse - shield;
        
            if (parseInt(result) >= parseInt(0)) {
                var coins = req.body.coins - req.body.shield;
                user.findOneAndUpdate({ _id: req.body.uid }, { $set: { coins: coins } }, { new: true }, (err, doc) => {
                    if (req.body.current_date == "0") {
                        vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { shield: "1", duration_shield: moment().add(req.body.date, 'hours').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
                    else {
                        vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { shield: "1", duration_shield: moment(req.body.current_date).add(req.body.date, 'hours').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
        
        
                });
        
        
                res.send("SHIELD")
            } else {
                res.send("You don't have enough money")
            }
    
        }    
    });    

    





});

router.route('/check_vip').put(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.uid)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            vip_shield.findOne({user_id:req.body.uid},(err,doc)=>
            {
                
                if(doc!=null)
               
            if (moment().countdown(moment(doc.duration_vip).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value >= 0) {
                let y=moment(doc.duration_vip).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString();
              
                res.send(y.substring(0, y.lastIndexOf("and")))
            } else {
                vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { vip: "0", duration_vip: "0" } }, { new: true }, (err, doc) => {
        
                });
                user.findOneAndUpdate({ _id: req.body.uid }, {
                    $set: {
                        hide_friends:"0",
                        hide_gifts: "0",
                        hide_status: "0",
                        
                    }
                }, { new: true }, (err, doc) => {
                    if(err)
                    {
                        res.send("node ")
                    }else{
                        res.end("Your data is updated successfully");
                    }
                });
            
                res.send("bad");
            }
        
            else
            res.send();
            });
        }
    });  

    
 



});

router.route('/check_shield').put(verifyToken,function (req, res) {
    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.uid)
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            vip_shield.findOne({user_id:req.body.uid},(err,doc)=>
            {
               if(doc!=null)
                 if (moment().countdown(moment(doc.duration_shield).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value >= 0) {
        
               // res.send(moment(doc.duration_shield).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString())
                let y=moment(doc.duration_shield).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString()
              
                res.send(y.substring(0, y.lastIndexOf("and")))
            } else {
                vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { shield: "0", duration_shield: "0" } }, { new: true }, (err, doc) => {
        
                });
        
                res.send("bad");
            }
            else
            res.send();
            });
        }
    });

    
 
    // if (moment().countdown(moment(req.body.date).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value >= 0) {

    //     res.send(moment(req.body.date).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString())

    // } else {
    //     vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { shield: "0", duration_shield: "0" } }, { new: true }, (err, doc) => {

    //     });

    //     res.send("bad");
    // }





});

router.route('/deactivate_shield').put(verifyToken,function (req, res) {


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
            vip_shield.findOneAndUpdate({ user_id: req.body.uid }, { $set: { shield: "0", duration_shield: "0" } }, { new: true }, (err, doc) => {
        
            });
            res.send("done")
        }
    });
    
});

router.route('/send_shield').put(verifyToken,function (req, res) {
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
            let coinse = req.body.coins;
            let shield = req.body.shield;
            let result = coinse - shield;
        
            if (parseInt(result) >= parseInt(0)) {
                var coins = req.body.coins - req.body.shield;
                user.findOneAndUpdate({ _id: req.body.uid }, { $set: { coins: coins } }, { new: true }, (err, doc) => {
                    vip_shield.findOne({user_id:req.body.id},(err,doc)=>
                    {
                    if (doc.duration_shield == "0") {
                        vip_shield.findOneAndUpdate({ user_id: req.body.id }, { $set: { shield: "1", duration_shield: moment().add(req.body.date, 'hours').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
                    else {
                        vip_shield.findOneAndUpdate({ user_id: req.body.id }, { $set: { shield: "1", duration_shield: moment(doc.duration_shield).add(req.body.date, 'hours').format().toString() } }, { new: true }, (err, doc) => {
        
                        });
                    }
        
                });
                });
        
        
                res.send("done")
            } else {
                res.send("You don't have enough money")
            }
        }
    });

    

    
});



router.route('/send_coins').put(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            if(authData.user.key!=req.body.sender_id)
            {
                
                res.sendStatus(403);
                return;
            }
            var coinse = req.body.coins;
             let sender_coins = req.body.sender_coins;
              let recevier_coins = req.body.recevier_coins;
              if(parseInt(req.body.sender_coins)>=parseInt(coinse))
              {
             conis_recevier.findOne({ $and: [{ sender_id: req.body.sender_id},{recevier_id: req.body.recevier_id }] }, (err, doc) => {
               
                 if (doc == null && parseInt(coinse) < 50) {
                   
                     var add = new conis_recevier();
                     add.coins_transfer = coinse;
                     add.time = "0";
                     add.sender_id = req.body.sender_id;
                     add.recevier_id = req.body.recevier_id;
                     add.save();
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 } else if (doc == null && parseInt(coinse) == 50 && req.body.reciver_vip == "0") {
                
                     var add = new conis_recevier();
                     add.coins_transfer = coinse;
                     add.time = moment().add(24, 'hours').format().toString();
                     add.sender_id = req.body.sender_id;
                     add.recevier_id = req.body.recevier_id;
                     add.save();
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 }
                 else if (doc == null && parseInt(coinse) >= 50 && req.body.reciver_vip == "1") {
                     
                     var add = new conis_recevier();
                     add.coins_transfer = coinse;
                     add.time =  moment().add(24, 'hours').format().toString();
                     add.sender_id = req.body.sender_id;
                     add.recevier_id = req.body.recevier_id;
                     add.save();
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 } else if (doc == null && parseInt(coinse) > 50 && req.body.reciver_vip == "0") {
                    
                     res.send("This user is not a vip person, you can just send 50 coins each 24 hours")
                 } else if (doc != null && 50 - parseInt(doc.coins_transfer) == parseInt(coinse) && req.body.reciver_vip == "0" && (moment().isBefore(moment(doc.time)) || doc.time=="0")) {
                     
                     conis_recevier.findOneAndUpdate({ $and: [{ sender_id: req.body.sender_id, recevier_id: req.body.recevier_id }] }, { $set: { coins_transfer: parseInt(doc.coins_transfer)+parseInt(coinse), time: moment().add(24, 'hours').format().toString() } }, { new: true }, (err, doc) => {
        
                     });
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 }else if(doc != null && parseInt(doc.coins_transfer)<=50 &&  req.body.reciver_vip == "0" && !moment().isBefore(moment(doc.time))&&doc.time!="0")
                 {
                    
                   
                        if(parseInt(coinse)<50){
                         
                     conis_recevier.findOneAndUpdate({ $and: [{ sender_id: req.body.sender_id, recevier_id: req.body.recevier_id }] }, { $set: { coins_transfer: coinse, time:"0"} }, { new: true }, (err, doc) => {
        
                     });
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 }
                     else if(parseInt(coinse)==50){
                       
                         conis_recevier.findOneAndUpdate({ $and: [{ sender_id: req.body.sender_id, recevier_id: req.body.recevier_id }] }, { $set: { coins_transfer: coinse, time:moment().add(24, 'hours').format().toString()} }, { new: true }, (err, doc) => {
        
                         });
                         modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                         res.send("done")
                     }else
                     {
                        
                         res.send("This user is not a vip person, you can just send 50 coins each 24 hours")
                     }
                    
                 } else if (doc != null && req.body.reciver_vip == "1") {
                     
                     conis_recevier.findOneAndUpdate({ $and: [{ sender_id: req.body.sender_id, recevier_id: req.body.recevier_id }] }, { $set: { coins_transfer:  parseInt(doc.coins_transfer)+parseInt(coinse), time:moment().add(24, 'hours').format().toString()} }, { new: true }, (err, doc) => {
        
                     });
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                     res.send("done")
                 }else  if(doc != null && 50 - parseInt(doc.coins_transfer) < parseInt(coinse) && req.body.reciver_vip == "0"){
                    
                     res.send("This user is not a vip person, you can just send 50 coins each 24 hours, You have sent "+doc.coins_transfer+" coins today")
                 }else  if(doc != null && 50 - parseInt(doc.coins_transfer) > parseInt(coinse) && req.body.reciver_vip == "0" &&(moment().isBefore(moment(doc.time)) || doc.time=="0")){
                     conis_recevier.findOneAndUpdate({ $and: [{ sender_id: req.body.sender_id, recevier_id: req.body.recevier_id }] }, { $set: { coins_transfer: parseInt(doc.coins_transfer)+parseInt(coinse), time:"0"} }, { new: true }, (err, doc) => {
        
                     });
                     modify_coins(req.body.sender_id,req.body.recevier_id ,coinse,recevier_coins,sender_coins)
                      res.send("done")
                  }
        
        
             });
         }
         else
         {
             res.send("you don't have enough money !")
         }
        
        
        function modify_coins(s_id,r_id,coinse,r_coins,s_coins)
        {
         user.findOneAndUpdate({ _id: s_id }, { $set: { coins: parseInt(s_coins)-parseInt(coinse) } }, { new: true }, (err, doc) => {
        
         });
         user.findOneAndUpdate({ _id: r_id }, { $set: { coins: parseInt(r_coins)+parseInt(coinse) } }, { new: true }, (err, doc) => {
        
         });
        }
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