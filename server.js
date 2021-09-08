'use strict';
require('./models/db');

const bodyParser = require('body-parser');
const user = require('./controllers/users');
const friend = require('./controllers/friends');
const favorites_fans = require('./controllers/favorites_fans');
const enemies = require('./controllers/enemies');
const requests_friends = require('./controllers/requests_friends');
const messages = require('./controllers/messages');
const gift = require('./controllers/gifts');
const gallery = require('./controllers/gallery');
const search = require('./controllers/search');
const admingift = require('./controllers/admingifts');
const bans_blocks = require('./controllers/bans_blocks');
const vip_shield = require('./controllers/vip_shield');
const live_chat = require('./controllers/live_room_info');
const settings = require('./controllers/settings');
const level_points = require('./controllers/level_points');
const powers = require('./controllers/powers');
const temp = require('./controllers/temb_user_login');
const post = require('./controllers/timelinepost');
var express = require('express');
var app = express();


var server = app.listen(4000)
var io = require('socket.io').listen(server);
// var app = express();

 const jwt = require('jsonwebtoken');


let ids = {}
io.on('connection', (client) => {
  client.on('register', function (data) {
    ids[data.id] = client.id

  }
  );
  
  const mongoose = require('mongoose');
  var user = mongoose.model('User');

  client.on('my other event', function (data) {


    io.to(ids[data.id]).emit('news', "ccc");
    io.to(ids[data.uid]).emit('news', "ggg");



  });

  client.on('send_coins', function (data) {

    io.to(ids[data.id]).emit('news', "ccc");
    io.to(ids[data.uid]).emit('coins', data);



  });

  client.on('messages', function (data) {


    // io.to(ids[data.id]).emit('messagesclient', "ccc");
    io.to(ids[data.uid]).emit('messagesclient', "ggg");



  });

  client.on('onlinUsersList', function (data) {


    // io.to(ids[data.id]).emit('messagesclient', "ccc");
    // io.to(ids[data.uid]).emit('messagesclient', "ggg");

    io.emit("refreshUsersList", "on")

  });

  client.on('addRemoveRoom', function (data) {


    // io.to(ids[data.id]).emit('messagesclient', "ccc");
    // io.to(ids[data.uid]).emit('messagesclient', "ggg");

    io.emit("refreshRooms", data)

  });

  client.on('ban_block', function (data) {


    
     //io.to(ids[data.Id]).emit('response', data);

   io.emit("response", data)

  });

  client.on('treasure', function (data) {


   
    io.emit("treasureList", data)

  

  });

  client.on('timeline', function (data) {


  
    io.emit("deploy", data)

  

  });


  client.on('timelinedelete', function (data) {


     io.emit("delete", data)
 
   
 
   });

   client.on('onopenroomstrack', function (data) {


    io.emit("allusers", data)

  

  });

  client.on('cameranumber', function (data) {


    io.emit("tocameranumber", data)



  });

  client.on('chatnumber', function (data) {


    io.emit("tochatnumber", data)



  });
  
});



app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())



var cors = require('cors');


app.use(cors());
app.use('/user', user, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/friend', friend, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/favorites_fans', favorites_fans, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/enemies', enemies, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/requests_friends', requests_friends, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/messages', messages, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/gift', gift, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/gallery', gallery, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/search', search, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});

app.use('/admingift', admingift, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});

app.use('/ban_block', bans_blocks, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});

app.use('/live_chat', live_chat, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});

app.use('/vip_shield', vip_shield, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/settings', settings, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/level_points', level_points, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});
app.use('/powers', powers, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});

app.use('/user_info', temp, (err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});


app.use('/timeline', post,(err, doc) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'delete,GET,POST');
  res.header('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,X-Access-Token,XKey,Authorization');
  res.header("Access-Control-Allow-Credentials", "true");
});









app.post('/api/posts', verifyToken, (req, res) => {  
  jwt.verify(req.token, 'localhost:123456:@#$%^&*NOACCESSHER', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        
        authData,
       
      });
    }
  });
});

app.post('/api/login', (req, res) => {
  // Mock user
  const user = {
    email: "backend@ashtechnoservices.com",
        JWT_KEY: "localhost:123456:@#$%^&*NOACCESSHER",
        password:"123456",
        key:"JIacKQATTdfd1109XZpwnvOYqFX2", 

     
    }

  jwt.sign({user}, 'localhost:123456:@#$%^&*NOACCESSHER', { expiresIn: '1d' }, (err, token) => {
    res.json({
      token
    });
  });
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
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


