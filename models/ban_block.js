const mongoose = require('mongoose');


var ban_block = new mongoose.Schema({
   
    blocker_bander: {
        type: String
    },
    block: {
        type: String
    },
    ban: {
        type: String
    },
    blocked_banned: {
        type: String
    }
});
mongoose.model("Ban_Block", ban_block);

