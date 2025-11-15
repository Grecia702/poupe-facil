import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@context/axiosInstance'

export const getProfile = async () => {
    const { data } = await api.get('/users/')
    return data
}

const changeProfilePic = async (data) => {
    await api.post('/users/profile-picture/', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    });
}

export const useChangeProfileMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: changeProfilePic,
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['profile'] });
        },
    });
}
