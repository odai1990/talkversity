const mongoose = require('mongoose');
var courses = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.String
    },
    title: {
        type: String
    },
    desc: {
        type: String
    },
    pref: {
        type: String
    }, 
    img1: {
        type: String
    },
    img2:{
        type:String
    },
    img3:
    {
        type:String
    },
    price:
    {
        type:String
    },
 
});
mongoose.model("Courses", courses);