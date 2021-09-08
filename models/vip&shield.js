const mongoose = require('mongoose');
var vip_shield = new mongoose.Schema({
   
    user_id: {
        type: String
    },
    vip: {
        type: String
    },
    duration_vip: {
        type: String
    },
    shield: {
        type: String
    },
    duration_shield: {
        type: String
    }
    
   
});
mongoose.model("Vip_Shield", vip_shield);