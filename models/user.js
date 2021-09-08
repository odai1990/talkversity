const mongoose = require('mongoose');
var user = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.String
    },
    FirstName: {
        type: String
    },
    LastName: {
        type: String
    },
    Birthday: {
        type: String
    },
    Country: {
        type: String
    },
    Gender: {
        type: String
    }
    ,
    Phone: {
        type: String
    },
    
    src: {
        type: String
    },
    number:{
        type:String
    },
    coins:
    {
        type:String
    },
    state:
    {
        type:String
    },
    hide_friends:
    {
        type:String
    },
    hide_gifts:
    {
        type:String
    },
    hide_status:
    {
        type:String
    },
    hide_visitors:
    {
        type:String
    },
    chat_private:
    {
        type:String
    },
    can_message:
    {
        type:String
    },
    level:{
        type:String
    }
    ,
    points:{
        type:String
    },
    role:
    {
        type:String
    }
    ,
    //new block method
    ban:
    {
        type:String
    }
    ,
    block:
    {
        type:String
    }
    ,
    password:
    {
        type:String
    }
    ,
    email:
    {
        type:String
    },
    Admin_id:
    {
        type:String
    }
});
mongoose.model("User", user);