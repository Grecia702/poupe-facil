import { useInfiniteQuery } from '@tanstack/react-query'
import api from '@context/axiosInstance'

const fetchPosts = async ({ pageParam = 1, queryKey }) => {
    const [, { tipo, natureza, orderBy, orderDirection }] = queryKey
    try {
        const response = await api.get('/profile/transaction', {
            params: {
                ...(natureza && { natureza }),
                tipo,
                orderBy,
                orderDirection,
                page: pageParam,
                limit: 12
            },
        })

        const { data, meta } = response.data;
        return { data, meta };
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
    }
}

export const usePosts = (filters) => {
    return useInfiniteQuery({
        queryKey: ['posts', filters],
        queryFn: fetchPosts,
        getNextPageParam: (lastPage) => {
            return lastPage?.meta?.hasNextPage ? lastPage?.meta?.page + 1 : undefined;
        },
    });
};
