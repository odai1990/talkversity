const mongoose = require('mongoose');
var user = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.String
    },
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    gender: {
        type: String
    }, 
    src: {
        type: String
    },
    role:{
        type:String
    },
    password:
    {
        type:String
    },
    email:
    {
        type:String
    },
 
});
mongoose.model("User", user);