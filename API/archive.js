const User = require('models/user').User;
const Curve = require('models/curve').Curve;

exports.get = function (req, res, next) {
    if (req.session.user == null) {
        res.sendStatus(402);
    } else {
        let userId = req.session.user._id;
        User.findById(userId, function (err, user) {
            if (err) return next(err);
            if (user) {
                Curve.find({userId: userId}, function (err, objects) {
                    res.send(objects);
                })
            }
        });
    }
};

exports.post = function (req, res, next) {
    if (req.session.user == null) {
        res.sendStatus(402);
    } else {
        let userId = req.session.user._id,
            name = req.body.name,
            bezierList = req.body.bezierList;
        let curve = new Curve({ name: name, bezierList: bezierList, userId: userId });
        curve.save(function (err) {
            if(err) return next(err);
            res.send(curve);
        });
    }
};