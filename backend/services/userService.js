const userModel = require('../models/userModel')

const getUserService = async (id) => {
    const { exists, result } = await userModel.get_user_by_id(id)
    if (!exists) {
        throw new Error('Usuario não encontrado')
    }
    return result
}

const changePictureService = async (imagePath, userId) => {
    await userModel.change_profile_pic(imagePath, userId)
}

module.exports = { getUserService, changePictureService }