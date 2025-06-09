import { TouchableOpacity, View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { colorContext } from '@context/colorScheme'
import { useContext, useState, useRef } from "react";
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
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const moreButtonRef = useRef(null);


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
        if (!isVisible) {
            moreButtonRef.current?.measureInWindow((x, y, width, height) => {
                setDropdownPosition({ x, y: y + height });
                setVisibleId(id);
            });
        } else {
            setVisibleId(null);
        }
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

    const DropDown = () => {
        return (
            <Modal
                visible={isVisible}
                transparent
                animationType="none"
                onRequestClose={() => setVisibleId(null)}
            >
                <Pressable style={{ flex: 1 }} onPress={() => setVisibleId(null)}>
                    <View
                        style={{
                            position: 'absolute',
                            top: dropdownPosition.y - 25,
                            left: dropdownPosition.x - 130,
                            width: 130,
                            backgroundColor: isDarkMode ? '#414141' : '#ebeaea',
                            borderRadius: 2,
                            paddingVertical: 10,
                            elevation: 10,
                            zIndex: 99,
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                navigation.navigate('EditTransactions', { transactionId: id });
                                setVisibleId(null);
                            }}
                            style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                        >
                            <Text style={{ color: isDarkMode ? '#EEE' : '#222', fontSize: 16 }}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setIsOpen(true)}
                            style={{ paddingVertical: 10, paddingHorizontal: 15 }}
                        >
                            <Text style={{ color: isDarkMode ? '#EEE' : '#222', fontSize: 16 }}>Apagar</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>


        );
    }

    return (
        <>
            {isVisible && <DropDown />}
            <View style={{ marginTop: 10, paddingBottom: 10, borderBottomWidth: hideOption ? 0 : 1, borderColor: isDarkMode ? '#dddddd8f' : '#7a7a7a8f' }}>

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
                                <TouchableOpacity ref={moreButtonRef} onPress={handleToggleDropdown}>
                                    <MaterialIcons name="more-vert" size={24} color={state ? "white" : "black"} />
                                </TouchableOpacity>
                            )
                            }
                        </View>
                    </View>
                </View>
            </View>
        </>
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
        right: 25,
        elevation: 10,
        borderRadius: 5,
        zIndex: 4,
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