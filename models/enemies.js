const mongoose = require('mongoose');

var enemies = new mongoose.Schema({
   
    user_id: {
        type: String
    },
    enemy_id: {
        type: String
    }
});

mongoose.model("Enemies", enemies);


