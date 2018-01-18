let sha1 = require('js-sha1');
let fs = require("fs");

exports.login = function (params) {
    let email = params.email;
    let password = sha1(params.password);
    let users = JSON.parse(fs.readFileSync(__basedir + "/database/login.json").toString());
    let loginUser = null;
    for (let user of users) {
        if (user.username === email && user.password === password) {
            loginUser = user;
        }
    }
    return loginUser;
};

