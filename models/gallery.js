const mongoose = require('mongoose');


var gallery = new mongoose.Schema({
   
    user_id: {
        type: String
    },
    src: {
        type: String
    },
    type:
    {
        type:String
    },
    name:
    {
        type:String 
    }
});
mongoose.model("Gallery", gallery);

