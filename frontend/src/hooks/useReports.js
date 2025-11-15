import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'

const getReports = async ({ queryKey }) => {
    const [, filters = {}] = queryKey
    const { period } = filters
    const { data } = await api.get('/reports/', {
        params: { period }
    })
    return data
}

export const useReports = (filters = {}) => {
    return useQuery({
        queryKey: ['reports', filters],
        queryFn: getReports,
    })
}
