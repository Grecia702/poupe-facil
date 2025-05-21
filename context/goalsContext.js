import React, { createContext, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@context/axiosInstance';
import { useAuth } from '@context/authContext';

export const GoalsContext = createContext();


const getGoals = async () => {
    const res = await api.get('/goals/activated');
    return res.data;
};

const getAllGoals = async () => {
    const res = await api.get('/goals/list');
    return res.data;
};

const createGoals = async (goalsData) => {
    const res = await api.post('/goals', goalsData);
    return res.data;
};

const updateGoals = async ({ id, ...data }) => {
    const res = await api.patch(`/goals/${id}`, data);
    return res.data;
};

const deleteGoals = async (id) => {
    const res = await api.delete(`/goals/${id}`);
    return res.data;
};

export const GoalsProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const { data: goalsData, isLoading: isGoalsLoading, refetch: refetchGoals } = useQuery({
        queryKey: ['goals_id'],
        queryFn: getGoals,
        enabled: isAuthenticated,
        staleTime: 60000,
        cacheTime: 300000,
        refetchInterval: 60000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: false,
        retry: false,
        onSuccess: (response) => {
            console.log('Dados agrupados no onSuccess:', response.data);
        },
        onError: (error) => {
            console.log('Erro na requisição de dados agrupados:', error);
        }
    });


    const createGoalsMutation = useMutation({
        mutationFn: createGoals,
    });

    const updateGoalsMutation = useMutation({
        mutationFn: updateGoals,
    });

    const deleteGoalsMutation = useMutation({
        mutationFn: deleteGoals,
        onSuccess: async () => {
            await queryClient.invalidateQueries(['goals_id']);
        },
        onError: (error) => console.log(error)
    });

    return (
        <GoalsContext.Provider value={{
            goalsData,
            isGoalsLoading,
            refetchGoals,
            createGoalsMutation,
            updateGoalsMutation,
            deleteGoalsMutation,
        }}>
            {children}
        </GoalsContext.Provider>
    );

}

export const useGoalsAuth = () => {
    return useContext(GoalsContext)
};
