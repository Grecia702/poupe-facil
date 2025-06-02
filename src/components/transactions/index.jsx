import { TouchableOpacity, View, Text, Pressable, StyleSheet } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { colorContext } from '@context/colorScheme'
import { useContext, useState } from "react";
import { useToast } from 'react-native-toast-notifications';
import { useTransactionAuth } from "@context/transactionsContext";
import { format } from 'date-fns';
import DangerModal from '@components/dangerModal';

export default function TransactionCard({ loadData, iconName, name_transaction, state, color, category, date, value, type, recurrence, isVisible, setVisibleId, id, hideOption, conta, onRefresh }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext)
    const [isOpen, setIsOpen] = useState(false)
    const { useFilteredTransacoes, deleteTransactionMutation } = useTransactionAuth();
    const toast = useToast();

    const handleDelete = () => {
        deleteTransactionMutation.mutate(id, {
            onSuccess: () => {
                toastSuccess();
                onRefresh();
                setIsOpen(prev => !prev);
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
        Transporte: 'directions-car',
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
                        position: 'absolute',
                        top: 0,
                        right: 20,
                        left: 0,
                        bottom: 0,
                    }}
                />

                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#414141' : '#ebeaea', }]}>
                    <TouchableOpacity
                        onPress={() => {
                            navigation.navigate('EditTransactions', { transactionId: id });
                            setVisibleId(null)
                        }}
                        style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                    >
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', fontSize: 16, textAlign: 'left' }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsOpen(prev => !prev)}
                        style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                    >
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', fontSize: 16, textAlign: 'left' }}>Apagar</Text>
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
        <View style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: hideOption ? 0 : 1, borderColor: isDarkMode ? '#dddddd8f' : '#7a7a7a8f' }}>
            {isVisible && <DropDown />}
            <View style={styles.container}>
                <View style={[styles.iconCard, { backgroundColor: color }]}>
                    <MaterialIcons
                        name={categoriaIcons[iconName] || 'help-outline'}
                        color="white"
                        size={28}
                    />
                </View>
                <View style={styles.info}>
                    <View>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={[styles.title, { color: state ? "#f1f1f1" : "#2e2e2e" }]}>{name_transaction}</Text>
                            {recurrence && (
                                <MaterialIcons
                                    name='repeat'
                                    color={state ? "#EEE" : "#222"}
                                    size={20}
                                />
                            )}
                        </View>
                        <Text style={[styles.text, { color: state ? "#e9e7e7" : "#4e4e4e" }]}>{category} - {type}</Text>
                        <Text style={[styles.text, { color: state ? "#e9e7e7" : "#4e4e4e" }]}>{conta} - {format(date, 'dd/MM/yyyy')}</Text>
                    </View>

                    <View style={{ flexDirection: 'row' }}>
                        <Text style={[styles.value, { color: state ? '#FFF' : '#303131', }]}>
                            {(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </Text>
                        {!hideOption && (
                            <TouchableOpacity onPress={handleToggleDropdown}>
                                <MaterialIcons
                                    name="more-vert" size={24}
                                    color={state ? "white" : "black"} />
                            </TouchableOpacity>)
                        }
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dropdown: {
        position: 'absolute',
        top: 0,
        width: 100,
        right: 20,
        elevation: 10,
        height: 'auto',
        borderRadius: 5,
        zIndex: 1,
    },
    iconCard: {
        borderRadius: 30,
        height: 48,
        width: 48,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    info: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontWeight: '500',
        fontSize: 14,
        marginRight: 5,

    },
    value: {
        fontSize: 16,
        fontWeight: '700',
        textAlign: 'right',
    },
    text: {
        fontSize: 12,
        fontWeight: 400
    },
})