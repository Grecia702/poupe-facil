import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'
import { subDays, startOfMonth } from 'date-fns/'

const fetchPosts = async ({ queryKey }) => {
    const [, filters = {}] = queryKey
    const {
        first_day = startOfMonth(new Date()).toISOString(),
        last_day = new Date().toISOString(),
        period = 'week'
    } = filters
    try {
        const response = await api.get('/profile/transaction/summary', {
            params: {
                first_day,
                last_day,
                period
            },
        })
        return response.data
    } catch (error) {
        console.error('Erro ao buscar posts:', error)
        throw error
    }
}


export const useTransactionSummary = (filters) => {
    return useQuery({
        queryKey: ['posts', filters],
        queryFn: fetchPosts,
    })
}