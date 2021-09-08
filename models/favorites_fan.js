const mongoose = require('mongoose');

var favorites_fan = new mongoose.Schema({
   
    fan_id: {
        type: String
    },
    favorite_id: {
        type: String
    }
});

mongoose.model("Favorites_fans", favorites_fan);


