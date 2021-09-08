const mongoose = require('mongoose');


var coins = new mongoose.Schema({
   
    coins_transfer: {
        type: String
    },
    time: {
        type: String
    },
    sender_id: {
        type: String
    },
    recevier_id: {
        type: String
    }
});
mongoose.model("Conis_recevier", coins);

