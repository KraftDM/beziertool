const winston = require('winston');
let ENV = process.env.NODE_ENV

function getLogger(module) {

    let path = module.filename.split('\\').slice(-2).join('\\');

    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                colorize: true,
                level: ENV == 'development' ? 'debug' : 'error',
                label: path
            })
        ]
    });
}

module.exports = getLogger;