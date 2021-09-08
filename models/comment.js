const mongoose = require('mongoose');

var comment = new mongoose.Schema({
   
    picture_id: {
        type: String
    },
    user_id: {
        type: String
    },
    comment:
    {
        type: String
    },
    date:
    {
        type: String
    }
});

mongoose.model("Comment", comment);


