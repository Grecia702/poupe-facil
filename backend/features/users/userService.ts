import * as userModel from './userModel.ts'
import type { UserInfo } from './userModel.ts'

const getUserService = async (id: number): Promise<UserInfo> => {
    const user = await userModel.get_user_by_id(id)
    if (!user) throw new Error('Usuario não encontrado')
    return user
}

const changePictureService = async (imagePath: string, userId: number): Promise<void> => {
    await userModel.change_profile_pic(imagePath, userId)
}

export { getUserService, changePictureService }