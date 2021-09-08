const mongoose = require('mongoose');

var messages = new mongoose.Schema({
   
    sender_id: {
        type: String
    },
    res_id: {
        type: String
    },
    mess:{
        type:String
    },
    date:{
        type:String
    }
});

mongoose.model("Messages", messages);


