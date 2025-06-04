const userModel = require('../models/userModel')

const getUserService = async (id) => {
    const { exists, result } = await userModel.get_user_by_id(id)
    if (!exists) {
        throw new Error('Usuario não encontrado')
    }
    return result
}

module.exports = { getUserService }