import winston from 'winston';
import type { TransformableInfo } from 'logform'
import { format as dateFormat } from 'date-fns';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.printf((info: TransformableInfo) => {
            const { level, message } = info;
            const timestamp = dateFormat(new Date(), 'yyyy-MM-dd HH:mm:ss');
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
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});


export default logger;
