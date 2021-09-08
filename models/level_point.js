const mongoose = require('mongoose');


var level_point = new mongoose.Schema({
   
    level: {
        type: Number
    },
    points: {
        type: Number
    }
});
mongoose.model("Level_Point", level_point);

