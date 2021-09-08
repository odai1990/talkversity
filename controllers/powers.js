const express = require('express');
var router = express.Router();
const mongoose = require('mongoose');
var user = mongoose.model('User');
var level_points = mongoose.model('Level_Point');
var power = mongoose.model('Power');
var moment = require('moment');
var countdown = require('moment-countdown');

const jwt = require('jsonwebtoken');

router.route('/send_power').put(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            console.log(req.body.person)
            var person = req.body.person;
            
            if(authData.user.key!= person.ids.uid )
            {
                
                res.sendStatus(403);
                return;
            }
            var array_list_errors = [];
            var sum_temp = 0;
            var sum_temp_points = 0;
            var sum_temp_damage = 0;
        //  var person = {
        //      ids: { id: "KASqj70doqgvIXYRcGaQFJDwUf83", uid: "8qGSJlZ1PKYpdZIv21JTNeWtLEe2", coins: "5555", vip: "0", shield: "0", handcuff: '0', points: "11000", level: "5",name:"odai" },
        //     //   protection: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //    handcuff: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     clear: { cost: "50", point_dmage: "123", point_benefits: "123", mimutes: "15" },
        //     //   shoes: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //   cow: { cost: "1", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //   monkey: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //   camera_block: { cost: "1", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //      // donkey: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //   lock: { cost: "1", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //     //   zombie: { cost: "2", point_dmage: "123", point_benefits: "123", mimutes: "0" },
        //     //   invisiable: { cost: "1", point_dmage: "123", point_benefits: "123", mimutes: "240" },
        //  };
           
           
        
        
        
        
        
        
        
            user.aggregate([
                {
                    $match:
                    {
                        _id: person.ids.id
                    }
                },
                {
                    $lookup:
                    {
                        from: "powers",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "all_powers"
                    }
                },
                {
                    $lookup:
                    {
                        from: "vip_shields",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "shield_vip"
                    }
                },
            ], function (err, result) {
                if (result != "") {
                   
        if(result[0].state=="offline")
        {
            res.send("This user is offline, You can\'t apply powers on him!")
            return;
            
        }
                    //to count coins
                    for (x in person) {
                        if (person[x].cost != null) {
                            sum_temp += parseInt(person[x].cost)
                        }
        
        
                    }
                    //check coins are enough
                    if (sum_temp <= parseInt(person.ids.coins)) {
                        sum_temp = 0;
                        if (person.ids.shield == "0") {
                            if (person.ids.handcuff == "0") {
                        if (result[0]['shield_vip'][0]['shield'] == "0") {
        
                            if (person.ids.vip == "1") {
                                check_level(person.ids.level, person.ids.points, result[0].level, result[0].points)
                            } else {
        
                                if (result[0]['shield_vip'][0]['vip'] == "0") {
                                    check_level(person.ids.level, person.ids.points, result[0].level, result[0].points);
        
                                }
                                else {
                                    res.send("You can not apply powers because who you are trying to apply powers on him, is VIP user !")
        
                                }
                            }
        
        
                        }
                        else {
                            array_list_errors.push("You can not apply powers because who you are trying to apply powers on him, have shield !")
                            res.send(JSON.stringify(array_list_errors))
                            // res.send("You can not apply powers because who you are trying to apply powers on him, have shield !")
                        }
                            } else {
                                res.send("You can not apply powers because you have handcuff !")
                            }
        
        
        
                        }
                         else {
                            res.send("You can not apply powers because you have an active shield, please remove shield from settings page to allows you to apply powers !")
                        }
        
                    }
                    else {
        
                        array_list_errors.push("you don't have enough money to applay powers !")
                        res.send(JSON.stringify(array_list_errors))
                        // res.send("you don't have enough money to applay powers")
                    }
        
        
        
        
                }
        
        
        
                function check_level(s_level, s_points, r_level, r_points) {
        
                    if (parseInt(s_level) >= parseInt(r_level)) {
        
                        for (x in person) {
        
                            if (x != "ids") {
                                var temp_active = x + "_active";
                                var temp_time = x + "_time";
                                if (x == "zombie" && result[0]['all_powers'][0]['protection_active'] == 0) {
                                    sum_temp += parseInt(person[x].cost)
                                    sum_temp_points += parseInt(person[x].point_benefits)
                                    sum_temp_damage += parseInt(person[x].point_dmage)
        
        
                                }
                                else {
                                    if (x == "clear") {
                                        sum_temp += parseInt(person[x].cost)
                                        sum_temp_points += parseInt(person[x].point_benefits)
                                        sum_temp_damage += parseInt(person[x].point_dmage)
                                        for (x in result[0].all_powers[0]) {
                                           
                                            if(x=="protection_time" || x=="handcuff_time" || x=="shoes_time" ||x=="cow_time" ||x=="monkey_time" ||x=="camera_block_time"||x=="donkey_time"||x=="lock_time"||x=="invisiable_time"){
                                            // if (x != "clear" && x != "ids" && x != "zombie")  
                                            
                                            var temp_words = x.split('_');
                                            if(temp_words[2]==null){
                                            clear(person['clear'].mimutes,temp_words[0])
                                           
                                            }
                                            else{
                                            clear(person['clear'].mimutes,temp_words[0]+"_"+temp_words[1])
                                            
                                            }
                                            }   
                                                 
                                       
                                        }
        
                                    }
                                    else {
                                        if (result[0]['all_powers'][0]['protection_active'] == 0) {
        
                                            if (result[0]['all_powers'][0][temp_time] == "0") {
        
                                                var t = moment().add(parseInt(person[x].mimutes), 'minutes').format().toString();
        
                                                sum_temp += parseInt(person[x].cost)
                                                sum_temp_points += parseInt(person[x].point_benefits)
                                                sum_temp_damage += parseInt(person[x].point_dmage)
        
                                                power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [x + "_active"]: 1, [x + "_time"]: t, [x + "_name"]: person.ids.name } }, { new: true }, (err, doc) => {
        
                                                });
        
        
                                            } else {
        
                                                var t = moment(result[0]['all_powers'][0][temp_time]).add(parseInt(person[x].mimutes), 'minutes').format().toString();
                                                var y = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).years;
                                                var ms = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).months;
                                                var d = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).days
                                                var h = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).hours;
                                                var m = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).minutes;
                                                var s = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).seconds;
        
                                                if ((y == 0 && ms == 0 && d == 0 && h == 8 && m == 0 && s == 0) || (y == 0 && ms == 0 && d == 0 && h < 8 && m >= 0 && s >= 0)) {
                                                    sum_temp += parseInt(person[x].cost)
                                                    sum_temp_points += parseInt(person[x].point_benefits)
                                                    sum_temp_damage += parseInt(person[x].point_dmage)
                                                    power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [x + "_active"]: 1, [x + "_time"]: t, [x + "_name"]: person.ids.name } }, { new: true }, (err, doc) => {
        
                                                    });
        
        
                                                }
                                                else {
        
                                                    array_list_errors.push("You can't apply " + x + " on this user, already is applied on him 8 hours")
                                                    // res.send("you can't applay more of this proparity")
                                                }
        
                                            }
                                        } else {
        
                                            if (x == "protection") {
        
                                                var t = moment(result[0]['all_powers'][0][temp_time]).add(parseInt(person[x].mimutes), 'minutes').format().toString();
                                                var y = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).years;
                                                var ms = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).months;
                                                var d = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).days
                                                var h = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).hours;
                                                var m = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).minutes;
                                                var s = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).seconds;
        
                                                if ((y == 0 && ms == 0 && d == 0 && h == 8 && m == 0 && s == 0) || (y == 0 && ms == 0 && d == 0 && h < 8 && m >= 0 && s >= 0)) {
                                                    sum_temp += parseInt(person[x].cost)
                                                    sum_temp_points += parseInt(person[x].point_benefits)
                                                    sum_temp_damage += parseInt(person[x].point_dmage)
                                                    power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [x + "_active"]: 1, [x + "_time"]: t, [x + "_name"]: person.ids.name } }, { new: true }, (err, doc) => {
        
                                                    });
                                                    array_list_errors.push("protection has added successfully but other powers you can't apply them, user have protection !")
                                                    res.send(JSON.stringify(array_list_errors));
                                                    // res.send("protection has added successfully but other powers you can't apply them, user have protection !");
                                                    return false;
                                                }
                                                else {
                                                    array_list_errors.push("You can't apply " + x + " on this user, already is applied on him 8 hours")
                                                    // array_list_errors.push(x)
                                                    // return false;
                                                }
        
                                            }
                                            else {
        
                                                if (array_list_errors.length == 1) {
                                                    array_list_errors.pop();
                                                }
                                                array_list_errors.push("You can not apply powers because who you are trying to apply powers on him, have protection !")
                                                res.send(JSON.stringify(array_list_errors));
                                                // res.send("You can not apply powers because who you are trying to apply powers on him, have protection !");
                                                return false;
                                            }
        
        
                                        }
                                    }
                                }
                            }
        
                        }
        
                        update_level_points(sum_temp_damage, sum_temp_points);
        
        
                    } else {
        
                        array_list_errors.push("You can't apply powers to users above your level, you just can apply power to users same your level or lower !")
                        res.send(JSON.stringify(array_list_errors));
                        //res.send("You can't apply powers to users above your level, you just can apply power to users same your level or lower !")
                    }
        
                }
        
        
        
        
        
                function update_level_points(points_d, points_p) {
        
                    var ckeck_points = 0;
                    if (parseInt(result[0].points) - sum_temp_damage <= 0) {
                        ckeck_points = 0;
                    }
                    else {
                        ckeck_points = parseInt(result[0].points) - sum_temp_damage;
                    }
        
                    level_points.aggregate([
                        {
                            $match:
                            {
                                $and: [{ points: { $lte: ckeck_points } }]
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
                            user.findOneAndUpdate({ _id: person.ids.id }, { $set: { level: result[0]['level'], points: ckeck_points } }, { new: true }, (err, doc) => {
        
                            });
        
                            level_points.aggregate([
                                {
                                    $match:
                                    {
                                        $and: [{ points: { $lte: parseInt(person.ids.points) + sum_temp_points } }]
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
                                    user.findOneAndUpdate({ _id: person.ids.uid }, { $set: { level: result[0]['level'], points: parseInt(person.ids.points) + sum_temp_points, coins: parseInt(person.ids.coins) - sum_temp } }, { new: true }, (err, doc) => {
        
                                        res.send(JSON.stringify(array_list_errors));
                                    });
        
                                } else {
                                    res.send(null);
                                }
        
                            });
        
                        } else {
                            res.send(null);
                        }
        
                    });
        
        
        
        
                }
        
        
        
                // function clear(munites, proparity_name) {
                //     user.aggregate([
                //         {
                //             $match:
                //             {
                //                 _id: person.ids.id
                //             }
                //         },
                //         {
                //             $lookup:
                //             {
                //                 from: "powers",
                //                 localField: "_id",
                //                 foreignField: "user_id",
                //                 as: "all_powers"
                //             }
                //         },
                //         {
                //             $lookup:
                //             {
                //                 from: "vip_shields",
                //                 localField: "_id",
                //                 foreignField: "user_id",
                //                 as: "shield_vip"
                //             }
                //         },
                //     ], function (err, result1) {
        
                //         var t = "0"
                //         var c = "0"
                //         if (result1[0]['all_powers'][0][proparity_name + "_time"] != "0") {
                //             t = moment(result1[0]['all_powers'][0][proparity_name + "_time"]).subtract(parseInt(munites), 'minutes').format().toString();
                //             c = moment().countdown(moment(t).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value;
                //         }
                //         else {
                //             c = -1;
                //         }
        
                //         if (c >= 0) {
                //             power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [proparity_name + "_active"]: 1, [proparity_name + "_time"]: t, [proparity_name + "_name"]: person.ids.name } }, { new: true }, (err, doc) => {
        
                //             });
                //         }
        
                //     });
        
        
                // }
        
                
                function clear(munites, proparity_name) {
                   
                    user.aggregate([
                        {
                            $match:
                            {
                                _id: person.ids.id
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "powers",
                                localField: "_id",
                                foreignField: "user_id",
                                as: "all_powers"
                            }
                        },
                        {
                            $lookup:
                            {
                                from: "vip_shields",
                                localField: "_id",
                                foreignField: "user_id",
                                as: "shield_vip"
                            }
                        },
                    ], function (err, result1) {
        
                        var t = "0"
                        var c = "0"
                        if (result1[0]['all_powers'][0][proparity_name + "_time"] != '0') {
                           
                            t = moment(result1[0]['all_powers'][0][proparity_name + "_time"]).subtract(parseInt(munites), 'minutes').format().toString();
                            c = moment().countdown(moment(t).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value;
                        }
                        else {
                            c = -1;
                        }
        
                        if (c >= 0) {
                            power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [proparity_name + "_active"]: 1, [proparity_name + "_time"]: t, [proparity_name + "_name"]: person.ids.name } }, { new: true }, (err, doc) => {
        
                            });
                        }else
                        {
                            power.findOneAndUpdate({ user_id: person.ids.id }, { $set: { [proparity_name + "_active"]:0, [proparity_name + "_time"]: "0", [proparity_name + "_name"]: "" } }, { new: true }, (err, doc) => {
        
                            });
                        }
        
                    });
        
        
                }
            });
        
        
        

        }    
    });    



});

router.route('/check_powers').put(verifyToken,function (req, res) {

    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            // if(authData.user.key!=req.body.uid )
            // {
                
            //     res.sendStatus(403);
            //     return;
            // }
            power.findOne({ user_id: req.body.uid }, (err, doc) => {
                if (doc != null)
        
                    if (moment().countdown(moment(doc[req.body.x + "_time"]).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value >= 0) {
        
                        // power.findOneAndUpdate({ user_id: req.body.uid }, { $set: { [req.body.x + "_active"]: 1, [req.body.x + "_time"]: moment(req.body.date).format() } }, { new: true }, (err, doc) => {
        
                        // });
                        power.find({ user_id: req.body.uid }, (err, doc) => {
        
                            var name = req.body.x + "_name";
        
                           
                            let y=moment(doc[0][req.body.x + "_time"]).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString() 
              
                            res.send(y.substring(0, y.lastIndexOf("and"))+ "\n sended by " + doc[0][name])
                           
                           // res.send(moment(doc[0][req.body.x + "_time"]).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString() + "\n sended by " + doc[0][name])
                        });
        
        
        
                    } else {
                        power.findOneAndUpdate({ user_id: req.body.uid }, { $set: { [req.body.x + "_active"]: 0, [req.body.x + "_time"]: "0", [req.body.x + "_name"]: "" } }, { new: true }, (err, doc) => {
        
                        });
        
                        res.send("bad");
                    }
        
                else
                    res.send();
        
            });
        }
    });


    // if (moment().countdown(moment(req.body.date).format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).value >= 0) {

    //     power.findOneAndUpdate({ user_id: req.body.uid }, { $set: { [req.body.x + "_active"]: 1, [req.body.x + "_time"]: moment(req.body.date).format() } }, { new: true }, (err, doc) => {

    //     });
    //     power.find({ user_id: req.body.uid }, (err, doc) => {

    //         var name=req.body.x+"_name";

    //         res.send(moment(req.body.date).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).toString()+"\n sended by "+ doc[0][name])
    //     });



    // } else {
    //     power.findOneAndUpdate({ user_id: req.body.uid }, { $set: { [req.body.x + "_active"]: 0, [req.body.x + "_time"]: "0",[req.body.x + "_name"]:"" } }, { new: true }, (err, doc) => {

    //     });

    //     res.send("bad");
    // }



});




// router.route('/test').put(function (req, res) {



//         var t = moment("2019-07-13T22:49:39+03:00").add(parseInt("15"), 'minutes').format().toString();
//         var y= moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).years;
//         var ms = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).months;
//         var d=moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).days
//         var h = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).hours;
//         var m = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).minutes;
//         var s = moment(t).countdown(moment().format().toString(), countdown.MONTHS | countdown.DAYS | countdown.HOURS | countdown.MINUTES | countdown.SECONDS, NaN, 5).seconds;

//         if ((y==0&& ms==0&&d==0&&h == 8 && m == 0 && s == 0) || (y==0&& ms==0&&d==0&&h < 8 && m >= 0 && s >= 0)) {
//            res.send("succes")
//         }
//         else {
// res.send("dddddddddddddddd")
//             // return false;
//         }


// });

router.route('/ckeck_shield_handcuff').put(verifyToken,function (req, res) {


    jwt.verify(req.token, "localhost:123456:@#$%^&*NOACCESSHER", (err, authData) => {
        if(err) {
           
          res.sendStatus(403);
          return;
        } else
        {
            
                if (person.ids.shield == "0") {
                    if (person.ids.handcuff == "0") {
                        res.send("true")
                    } else {
                        res.send("You can not apply powers because you have handcuff !")
                    }
            
            
            
                }
                else {
                    res.send("You can not apply powers because you have an active shield, please remove shield from settings page to allows you to apply powers !")
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