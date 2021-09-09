'use strict';
require('./models/db');

const bodyParser = require('body-parser');
const user = require('./controllers/users');
var express = require('express');
var app = express();

app.listen(4000, () => {
  console.log(`connect on ${4000}`);
})



var cors = require('cors');


app.use(cors());
app.use('/user', user, (err, doc) => {});
