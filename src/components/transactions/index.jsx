import { TouchableOpacity, View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { CardTransaction, Title, Date, IconCard, InfoView, Value } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { colorContext } from '@context/colorScheme'
import { useContext, useState } from "react";
import { useToast } from 'react-native-toast-notifications';
import { useTransactionAuth } from "@context/transactionsContext";
import { format } from 'date-fns';
import DangerModal from '@components/dangerModal';

export default function TransactionCard({ loadData, iconName, state, color, category, date, value, type, recurrence, isVisible, setVisibleId, id, hideOption }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext)
    const [isOpen, setIsOpen] = useState(false)
    const { useFilteredTransacoes, deleteTransactionMutation } = useTransactionAuth();
    const { refetch } = useFilteredTransacoes();
    const toast = useToast();


    const handleDelete = () => {
        deleteTransactionMutation.mutate(id, {
            onSuccess: () => {
                setIsOpen(prev => !prev);
                toastSuccess();
                refetch();
            },
            onError: (error) => toastError(error),
        });
    }

    const toastSuccess = () => {
        toast.show('Transação apagada com sucesso', {
            type: 'success',
            duration: 2500,
        });
    }

    const toastError = (text) => {
        toast.show(`${text}`, {
            type: 'error',
            duration: 1500,
        });
    }

    const handleToggleDropdown = () => {
        setVisibleId(isVisible ? null : id);
    };

    const categoriaIcons = {
        Contas: 'credit-card',
        Alimentação: 'restaurant-menu',
        Carro: 'directions-car',
        Internet: 'computer',
        Lazer: 'beach-access',
        Educação: 'menu-book',
        Compras: 'shopping-cart',
        Saúde: 'medication',
        Outros: 'more-horiz',
    };

    const handleClose = () => {
        setVisibleId(null);
    };

    const DropDown = () => {
        return (
            <>
                <Pressable
                    onPress={handleClose}
                    style={{
                        zIndex: 1,
                    }}
                />

                <View style={{
                    position: 'absolute',
                    top: 0,
                    right: 20,
                    backgroundColor: isDarkMode ? '#3b3b3b' : "#d2ecd4",
                    elevation: 10,
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 'auto',
                    zIndex: 1,
                }}>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('EditTransactions', { transactionId: id });
                        setVisibleId(null)
                    }
                    } style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Editar</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#222", height: 2, width: '100%' }} />
                    <TouchableOpacity onPress={() => setIsOpen(prev => !prev)}
                        style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Apagar</Text>
                    </TouchableOpacity>
                    <DangerModal
                        open={isOpen}
                        setOpen={setIsOpen}
                        loadData={loadData}
                        onPress={() => handleDelete()}
                    />
                </View>
            </>
        );
    }

    return (
        <View style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: 1, borderColor: isDarkMode ? '#dddddd8f' : '#7a7a7a8f' }}>
            {isVisible && <DropDown />}
            <CardTransaction >
                <IconCard color={color}>
                    <MaterialIcons
                        name={categoriaIcons[iconName] || 'help-outline'}
                        color="white"
                        size={24}
                    />

                </IconCard>

                <InfoView>
                    <View style={{ flexDirection: 'row' }}>
                        <Title $state={state}>{category}</Title>
                        {recurrence && (
                            <MaterialIcons
                                name='repeat'
                                color={state ? "#EEE" : "#222"}
                                size={20}
                            />
                        )}
                    </View>
                    <Date $state={state}>{type.charAt(0).toUpperCase() + type.slice(1)} - {format(date, 'dd/MM/yyyy')}</Date>
                </InfoView>

                <Value $state={state}>{(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Value>
                {!hideOption && (
                    <TouchableOpacity onPress={handleToggleDropdown}>
                        <MaterialIcons
                            name="more-vert" size={24}
                            color={state ? "white" : "black"} />
                    </TouchableOpacity>)
                }
            </CardTransaction>
        </View>
    )
}
