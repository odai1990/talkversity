const mongoose = require('mongoose');
var Post = new mongoose.Schema({
   
    user_id: {
        type: String
    },
    message_post: {
        type: String
    },
    image_post: {
        type: String
    },
    video_post: {
        type: String
    },
    time_post: {
        type: String
    },
    like_post: {
        type: String
    },
    dislike_post: {
        type: String
    },
    seeit_post: {
        type: String
    },
    type_post: {
        type: String
    },
    Admin_treasure_post:
    {
        type: String
    },
    cancled:
    {
        type: Boolean
    },
    
    
    
    
    
   
});
mongoose.model("Post", Post);