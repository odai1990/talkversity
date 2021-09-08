const mongoose = require('mongoose');

var temp = new mongoose.Schema({
   
    uid:{
type:String
    },
    first_name: {
        type: String
    },
    last_name: {
        type: String
    }
});

mongoose.model("Temp_User_Login", temp);


