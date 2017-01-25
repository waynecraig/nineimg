const config = require('../config');
const winston = require('winston');
require('winston-mongodb').MongoDB;

winston.add(winston.transports.MongoDB, {
    db: config.dburl,
    collection: 'logs',
    level: 'info'
});

module.exports = winston;
