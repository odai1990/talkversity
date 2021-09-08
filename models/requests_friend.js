const mongoose = require('mongoose');

var requests_friends = new mongoose.Schema({
   
    primary_user: {
        type: String
    },
    request_id: {
        type: String
    }
});

mongoose.model("Requests_friends", requests_friends);


