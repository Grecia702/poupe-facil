
import React, { useState, useContext } from 'react'
import { Pressable, View, Text, Modal, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AccountCard, Balance, IconCard, InfoView, TextContainer, Title } from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { useContasAuth } from '@context/contaContext';
import { colorContext } from '@context/colorScheme'
import { useToast } from 'react-native-toast-notifications';


const ModalConfirmDelete = ({ open, setOpen, isDarkMode, accountId, setRefreshing }) => {
    const { deleteConta, refetch } = useContasAuth();
    const toast = useToast();

    const showNotif = ({ setOpen, accountId }) => {
        setOpen(prev => !prev)
        console.log('exibindo toast')
        toast.show('Conta deletada com sucesso', {
            type: 'success',
            duration: 1500,
        });
        setRefreshing(prev => !prev);
        setTimeout(() => {
            deleteConta(accountId)
            refetch()
        }, 2000);
        setTimeout(() => {
            setRefreshing(prev => !prev);
        }, 3500);

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
                    <Text style={{ width: 180, fontWeight: 500, lineHeight: 20, textAlign: 'center', color: isDarkMode ? "#FFF" : "#333" }}>
                        Você tem certeza que
                        quer apagar esta conta?
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'stretch' }}>

                        <TouchableOpacity onPress={() => setOpen(prev => !prev)}
                            style={{ padding: 8, backgroundColor: '#b8b6b6', borderRadius: 5 }}
                        >
                            <Text>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showNotif({ setOpen, accountId })}
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



export default function Account({ name, value, icon, color, textColor, isVisible, setVisibleId, setRefreshing, id }) {
    const { isDarkMode } = useContext(colorContext)
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false)

    const handleToggleDropdown = () => {
        setVisibleId(isVisible ? null : id);
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
                    backgroundColor: isDarkMode ? '#3b3b3b' : '#cceed9',
                    elevation: 10,
                    borderWidth: 1,
                    borderRadius: 6,
                    height: 'auto',
                    zIndex: 1,
                }}>
                    <TouchableOpacity onPress={() => navigation.navigate('EditAccount', { accountId: id })
                    } style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Editar</Text>
                    </TouchableOpacity>
                    <View style={{ backgroundColor: "#22222288", height: 1, width: '100 %' }} />
                    <TouchableOpacity onPress={() => setIsOpen(prev => !prev)}
                        style={{ paddingVertical: 10, paddingHorizontal: 20 }}>
                        <Text style={{ color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Apagar</Text>
                    </TouchableOpacity>
                    <ModalConfirmDelete
                        open={isOpen}
                        setRefreshing={setRefreshing}
                        setOpen={setIsOpen}
                        accountId={id}
                        isDarkMode={isDarkMode}
                    />
                </View>
            </>
        );
    }

    return (

        <>
            {isVisible && <DropDown />}
            <AccountCard>
                <IconCard color={color}>
                    <MaterialIcons
                        name={icon}
                        size={24} color={textColor}
                    />
                </IconCard>
                <TextContainer>
                    <Title color={textColor}>{name}</Title>
                </TextContainer>
                <InfoView>
                    <Balance color={textColor}>{value}</Balance>
                    <TouchableOpacity onPress={handleToggleDropdown}>
                        <MaterialIcons
                            name="more-vert" size={24}
                            color={textColor}
                        />
                    </TouchableOpacity>
                </InfoView>
            </AccountCard>
        </>
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