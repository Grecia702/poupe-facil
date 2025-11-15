import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@context/axiosInstance'
import { useAuth } from '@context/authContext';


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
                limit: 15
            },
        })

        const { data, meta } = response.data;
        return { data, meta };
    } catch (error) {
        console.error('Erro ao buscar posts:', error);
        throw error;
    }
}

const createTransaction = async (transactionData) => {
    try {
        const { data } = await api.post('/profile/transaction', transactionData)
        return data
    } catch (error) {
        console.error('Erro ao criar transação:', error)
        throw error
    }
}


export const useCreateTransaction = () => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createTransaction,
        enabled: isAuthenticated,
        // onSuccess: () => {
        //     queryClient.invalidateQueries(['posts'])
        // }
    })
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

const getTransacoesByID = async (id) => {
    try {
        console.log('Iniciando requisição para transações...');
        const { data } = await api.get(`/profile/transaction/${id}`);
        return data;
    } catch (error) {
        throw error;
    }
};

export const useTransactionByID = (id, isAuthenticated) => {
    return useQuery({
        queryKey: ['transaction_by_id', id],
        queryFn: () => getTransacoesByID(id),
        enabled: isAuthenticated && !!id,
    })
}