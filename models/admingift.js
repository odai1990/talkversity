const mongoose = require('mongoose');


var admingift = new mongoose.Schema({
   
    src: {
        type: String
    },
    type: {
        type: String
    },
    price: {
        type: String
    },
    point: {
        type: String
    }
});
mongoose.model("AdminGift", admingift);

