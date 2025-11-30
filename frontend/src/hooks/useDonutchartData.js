import { useQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'
import { subDays, startOfMonth, startOfDay } from 'date-fns/'


const getCategoriesTransactions = async ({ queryKey }) => {
    const [, filters = {}] = queryKey
    const {
        first_day = startOfMonth(new Date().toISOString()),
        last_day = startOfDay(new Date().toISOString()),
    } = filters
    try {
        const response = await api.get('/profile/transaction/categories', {
            params: {
                first_day,
                last_day
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const useDonutchartData = (filters) => {
    return useQuery({
        queryKey: ['categories_posts', filters],
        queryFn: getCategoriesTransactions,
    })
}