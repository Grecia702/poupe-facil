import winston from 'winston';
import type { TransformableInfo } from 'logform';
import { format as dateFormat } from 'date-fns';

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf((info: TransformableInfo) => {
            const { level, timestamp, ...meta } = info;
            const formattedTime = dateFormat(new Date(timestamp as string), 'yyyy-MM-dd HH:mm:ss');
            const message = JSON.stringify(meta);
            return `${formattedTime} ${level}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize({ level: true }),
                winston.format.printf((info: TransformableInfo) => {
                    const { level, timestamp, ...meta } = info;
                    const formattedTime = dateFormat(new Date(timestamp as string), 'yyyy-MM-dd HH:mm:ss');
                    return `${formattedTime} ${level}: ${JSON.stringify(meta)}`;
                })
            )
        }),

        new winston.transports.File({
            filename: 'logs/app.log',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5,
        })
    ]
});

export default logger;