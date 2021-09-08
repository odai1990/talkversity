const mongoose = require('mongoose');

var powers = new mongoose.Schema({
   
    user_id:
    {
        type: String
    },
    protection_active: {
        type: Number
    },
    protection_time: {
        type: String
    },
    protection_name: {
        type: String
    },
    handcuff_active: {
        type: Number
    },
    handcuff_time: {
        type: String
    },
    handcuff_name: {
        type: String
    },
    shoes_active: {
        type: Number
    },
    shoes_time: {
        type: String
    },
    shoes_name: {
        type: String
    },
    cow_active: {
        type: Number
    },
    cow_time: {
        type: String
    },
    cow_name: {
        type: String
    },
    monkey_active: {
        type: Number
    },
    monkey_time: {
        type: String
    },
    monkey_name: {
        type: String
    },
    camera_block_active: {
        type: Number
    },
    camera_block_time: {
        type: String
    },
    camera_block_name: {
        type: String
    },
    donkey_active: {
        type: Number
    },
    donkey_time: {
        type: String
    },
    donkey_name: {
        type: String
    },
    lock_active: {
        type: Number
    },
    lock_time: {
        type: String
    },
    lock_name: {
        type: String
    },
    invisiable_active: {
        type: Number
    },
    invisiable_time: {
        type: String
    },
    invisiable_name: {
        type: String
    }

});

mongoose.model("Power", powers);