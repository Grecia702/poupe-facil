const { getReportsService, getReportByIDService } = require('../services/financial-report-service')
const logger = require("../utils/loggerConfig")

const getReport = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const reports = await getReportsService(userId)
        return res.status(200).json(reports)
    } catch (error) {
        logger.error(`Erro inesperado: ${error.message}`)
    }
}

const getReportByID = async (req, res) => {
    try {
        const { userId } = req.user.decoded
        const { id } = req.params
        const reports = await getReportByIDService(userId, id)
        return res.status(200).json(reports)
    } catch (error) {
        logger.error(`Erro inesperado: ${error.message}`)
    }
}

module.exports = { getReport, getReportByID }