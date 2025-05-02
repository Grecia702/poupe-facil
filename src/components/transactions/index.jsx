import { TouchableOpacity, View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { CardTransaction, Title, Date, IconCard, InfoView, Value } from "./styles";
import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from '@react-navigation/native';
import { colorContext } from '@context/colorScheme'
import { useContext, useState } from "react";
import { useToast } from 'react-native-toast-notifications';
import { useTransactionAuth } from "@context/transactionsContext";
import { loadData } from "@shopify/react-native-skia";


const ModalConfirmDelete = ({ open, setOpen, isDarkMode, transactionId, loadData }) => {
    const { refetch, deleteTransactionMutation } = useTransactionAuth();
    const toast = useToast();


    const deleteTransaction = (transactionId) => {
        deleteTransactionMutation.mutate(transactionId, {
            onSuccess: () => showDeleteNotif(),
            onError: (error) => toastError(error),
        });
    }

    const showDeleteNotif = () => {
        setOpen(prev => !prev)
        toast.show('Conta deletada com sucesso', {
            type: 'success',
            duration: 1500,
        });
        setTimeout(() => {
            loadData()
        }, 500);
    }

    return (
        <Modal
            transparent
            visible={open}
            animationType="fade"
            onRequestClose={() => setOpen(false)}
        >
            <Pressable style={styles.overlay} onPress={() => setOpen(prev => !prev)}>
                <View style={[styles.modal, { backgroundColor: isDarkMode ? "#333" : "#e8f5e6" }]}>
                    <Text style={{ lineHeight: 20, textAlign: 'center', color: isDarkMode ? "#e8f5e6" : "#333" }}>
                        Você tem certeza que quer {'\n'}
                        apagar esta transação?
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>

                        <TouchableOpacity onPress={() => setOpen(prev => !prev)}
                            style={{ padding: 8, backgroundColor: '#b8b6b6', borderRadius: 5 }}
                        >
                            <Text>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => deleteTransaction(transactionId)}
                            style={{ padding: 8, backgroundColor: '#ca4c4c', borderRadius: 5 }}
                        >
                            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Deletar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Pressable>
        </Modal>
    )
}


export default function TransactionCard({ loadData, iconName, state, color, category, date, value, type, isVisible, setVisibleId, id }) {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext)
    const [isOpen, setIsOpen] = useState(false)

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
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
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
                    <TouchableOpacity onPress={() => navigation.navigate('EditTransactions', { transactionId: id })
                    } style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Editar</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#222", height: 2, width: '100 %' }} />
                    <TouchableOpacity onPress={() => setIsOpen(prev => !prev)}
                        style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'center' }}>Apagar</Text>
                    </TouchableOpacity>
                    <ModalConfirmDelete
                        open={isOpen}
                        setOpen={setIsOpen}
                        loadData={loadData}
                        transactionId={id}
                        isDarkMode={isDarkMode}
                    />
                </View>
            </>
        );
    }

    return (
        <View style={{ position: 'relative' }}>
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
                    <Title $state={state}>{category}</Title>
                    <Date $state={state}>{type} - {date}</Date>
                </InfoView>

                <Value $state={state}>{value}</Value>
                <TouchableOpacity onPress={handleToggleDropdown}>
                    <MaterialIcons
                        name="more-vert" size={24}
                        color={state ? "white" : "black"} />
                </TouchableOpacity>
            </CardTransaction>

        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        padding: 20,
        gap: 20,
        borderRadius: 10,
    },
    dropdown: {
        alignItems: 'center',
        maxWidth: '60%',
        padding: 20,
        gap: 10,
        borderRadius: 10,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
    },
})