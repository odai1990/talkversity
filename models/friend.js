const mongoose = require('mongoose');


var friend = new mongoose.Schema({
   
    primary_user: {
        type: String
    },
    friend_id: {
        type: String
    }
});
mongoose.model("Friends", friend);

