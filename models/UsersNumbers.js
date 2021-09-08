const mongoose = require('mongoose');
var UsersN = new mongoose.Schema({
   
    Admin_number: {
        type: Number
    },
    Profile_number: {
        type: Number
    }
});
mongoose.model("UsersN", UsersN);