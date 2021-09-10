const mongosse = require('mongoose');
mongosse.connect('mongodb+srv://odai22odai78:ttxjWLjtk6VbNHok@cluster0.vufe9.mongodb.net/test', { useNewUrlParser: true }, (err) => {
    if (!err) {
        console.log('Connected!')
    }
    else {
        console.log('Not Connected!')
    }
});

require("./user");
require("./course");
