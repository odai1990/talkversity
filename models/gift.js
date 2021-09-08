const mongoose = require('mongoose');


var gift = new mongoose.Schema({
   
    sender_id: {
        type: String
    },
    rec_id: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    price: {
        type: String
    },
    src: {
        type: String
    },
    name:
    {
        type:String
    },
    gender:
    {
        type:String
    }
});
mongoose.model("Gift", gift);

