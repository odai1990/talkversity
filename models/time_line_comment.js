const mongoose = require('mongoose');
var CommentP = new mongoose.Schema({
   
    post_id: {
        type: String
    },
    message_comment: {
        type: String
    },    
    time_comment: {
        type: String
    },
    like_comment: {
        type: String
    },
    id_commenter: {
        type: String
    }
    
    
    
    
    
   
});
mongoose.model("CommentP", CommentP);