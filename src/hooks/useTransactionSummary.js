import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'

const fetchPosts = async ({ queryKey }) => {
    const today = new Date().toISOString()
    const [, { date = today, period = 'week', all }] = queryKey

    try {
        const response = await api.get('/profile/transaction/summary', {
            params: { date, all, period },
        })

        // console.log('response.data:', response.data)
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
