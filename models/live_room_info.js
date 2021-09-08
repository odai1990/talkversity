const mongoose = require('mongoose');


var live_chat = new mongoose.Schema({
   
    room_name: {
        type: String
    },
    camera_source: {
        type: String
    },
    mic_source: {
        type: String
    },
    limitations: {
        type: String
    },
    user_id:
    {
        type: String
    },
    password:
    {
        type: String
    },
    messages:{
        type:Array
    },
    level:
    {
        type: String
    },
    gender:
    {
        type: String
    },
    sesion_id:
    {
        type: String
    },
    token:
    {
        type: String
    },
    AppID:
    {
        type: String
    }
});
mongoose.model("Live_Room_Info", live_chat);

