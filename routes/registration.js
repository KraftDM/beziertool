const User = require('models/user').User;
const async = require('async');
const HttpError = require('error').HttpError;
const path = require('path');

exports.get = function (req, res){
    res.sendFile('/registration.html', { root: path.join(__dirname, '../public')});
};

exports.post = function (req, res, next){
    let mail = req.body.mail;
    let password = req.body.password;
    let username = req.body.username;

    User.findOne({mail: mail}, function(err, user) {
        if(user != null) {
            res.sendStatus(402);
    } else {
            let user = new User({username: username, mail: mail, password: password });
            user.save(function (err) {
                if (err) return next(err);
                req.session.user = user;
                res.status(200);
                res.send(user);
            });
        }
    });
};