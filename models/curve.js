const mongoose = require('../libs/mongoose'),
    Schema = mongoose.Schema;

const schema = new Schema({
    userId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        default: 'Curve'
    },
    date:{
        type: Date,
        default: Date.now()
    },
    bezierList: []
});

exports.Curve = mongoose.model('Curve', schema);