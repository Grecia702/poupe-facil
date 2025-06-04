import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'

export const getProfile = async () => {
    const { data } = await api.get('/users/')
    return data
}

export const useProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
    })
}
