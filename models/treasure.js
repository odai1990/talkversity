const mongoose = require('mongoose');
var Treasure = new mongoose.Schema({
   
    image_treasure: {
        type: String
    },
    src_user: {
        type: String
    },    
    gender_user: {
        type: String
    },
    fn_user: {
        type: String
    },
    ln_user: {
        type: String
    },
    date: {
        type: String
    },
    id_user: {
        type: String
    }
    ,
    video_post: {
        type: String
    }
    ,
    message_post: {
        type: String
    }
    ,
    image_post: {
        type: String
    }
    ,
    type_post: {
        type: String
    }
    ,
    message_comment: {
        type: String
    }
    
    
    
    
   
});
mongoose.model("Treasure", Treasure);