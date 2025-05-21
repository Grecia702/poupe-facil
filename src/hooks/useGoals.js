import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'

const fetchGoals = async ({ queryKey }) => {
    const [, filters = {}] = queryKey
    const {
        status_meta = 'ativa',
    } = filters
    try {
        const response = await api.get('/goals/list', {
            params: {
                status_meta,
            },
        })
        return response.data
    } catch (error) {
        console.error('Erro ao buscar metas:', error)
        throw error
    }
}


export const useGoals = (filters) => {
    return useQuery({
        queryKey: ['goals', filters],
        queryFn: fetchGoals,
    })
}