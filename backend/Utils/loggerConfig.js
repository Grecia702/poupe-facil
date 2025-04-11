const winston = require('winston');
const moment = require('moment'); // Importando o Moment.js
// Criando o logger
const logger = winston.createLogger({
    level: 'info', // O nível de log padrão
    format: winston.format.combine(
        winston.format.timestamp({
            format: () => moment().format('YYYY-MM-DD HH:mm:ss') // Formato personalizável
        }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} ${level}: ${message}`;
        })
    ),
    transports: [
        // Transpote para o console com colorização
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Adiciona cores apenas no console
                winston.format.simple()
            )
        }),
        // Transporte para arquivo sem colorização
        new winston.transports.File({ filename: 'logs/app.log' })
    ]
});

// Exemplo de log
logger.info('Informação importante');
logger.warn('Aviso');
logger.error('Erro encontrado');

module.exports = logger;
