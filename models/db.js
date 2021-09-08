const mongosse = require('mongoose');
mongosse.connect('mongodb://mongoadmin:kh0L!#$%7U@52.34.227.253:27017/egowego', { useNewUrlParser: true }, (err) => {
    if (!err) {
    }
    else {
    }
});
require("./user");
require("./friend");
require("./favorites_fan");
require("./enemies");
require("./requests_friend");
require("./message");
require("./gift");
require("./gallery");
require("./comment");
require("./admingift");
require("./ban_block");
require("./live_room_info");
require("./vip&shield");
require("./level_point");
require("./power");
require("./coins_receivers");
require("./temp_user_data");
require("./time_line_post");
require("./time_line_comment");
require("./time_line_comment_reply");
require("./treasure");
require("./UsersNumbers");
