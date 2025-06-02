const winston = require('winston');
const { format } = require('date-fns');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(

        winston.format.printf(({ level, message }) => {
            const timestamp = format(new Date(), 'yyyy-MM-dd HH:mm:ss');
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        }),
        new winston.transports.File({ filename: 'logs/cronjob.log' })
    ]
});


module.exports = logger;
