import { useState } from "react";
import { useTransactionAuth } from "@context/transactionsContext";
import { useNavigation } from "@react-navigation/native";
import { Toast, useToast } from "react-native-toast-notifications";
import { Transaction } from "@shared/types/transaction";

export const useTransactionActions = (transactionId: number) => {
    const navigation = useNavigation();
    const toast = useToast();
    const { deleteTransactionMutation } = useTransactionAuth();
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const openDeleteModal = () => setIsDeleteModalOpen(true);
    const closeDeleteModal = () => setIsDeleteModalOpen(false);

    const showToast = (message: string, type = 'success') => {
        toast.show(message, {
            type,
            duration: 3000
        })
    }

    const handleEdit = (transaction: Transaction) => {
        navigation.navigate('EditTransactions', {
            transactionId,
            data: transaction
        })
    }

    const handleDelete = () => {
        deleteTransactionMutation.mutate(transactionId, {
            onSuccess: () => {
                showToast('Transação excluída com successo')
                closeDeleteModal
            },
            onError: (error) => showToast(error.message),
        });
    }

    return {
        isDeleteModalOpen,
        handleDelete,
        handleEdit,
        openDeleteModal,
        closeDeleteModal
    }
}