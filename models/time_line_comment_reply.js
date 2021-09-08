const mongoose = require('mongoose');
var CommentReply = new mongoose.Schema({
   
    comment_id: {
        type: String
    },
    message_comment_reply: {
        type: String
    },    
    time_comment_reply: {
        type: String
    },
    like_comment_reply: {
        type: String
    },
    id_replier: {
        type: String
    }
    ,
    post_id: {
        type: String
    }
    
    
    
    
    
   
});
mongoose.model("CommentReply", CommentReply);