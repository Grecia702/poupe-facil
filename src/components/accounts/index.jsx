
import React, { useState, useContext, useRef } from 'react'
import { Pressable, View, Text, StyleSheet, Modal } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AccountCard, Balance, IconCard, InfoView, TextContainer, Title } from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { useContasAuth } from '@context/contaContext';
import { colorContext } from '@context/colorScheme'
import { useToast } from 'react-native-toast-notifications';
import DangerModal from '@components/dangerModal';


export default function Account({ name, value, icon, color, textColor, isVisible, setVisibleId, setRefreshing, id, hideOption, isPrimary }) {
    const { isDarkMode } = useContext(colorContext)
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false)
    const toast = useToast();
    const { deleteConta, refetch, setAccountPrimaryMutation } = useContasAuth();
    const [dropdownPosition, setDropdownPosition] = useState({ x: 0, y: 0 });
    const moreButtonRef = useRef(null);

    const handleClose = () => {
        setVisibleId(null);
    };
    const showNotif = () => {
        setIsOpen(prev => !prev)
        toast.show('Conta deletada com sucesso', {
            type: 'success',
            duration: 1500,
        });
        setRefreshing(prev => !prev);
        setTimeout(() => {
            deleteConta(id)
            refetch()
        }, 2000);
        setTimeout(() => {
            setRefreshing(prev => !prev);
        }, 3500);
    }

    const handleSetPrimary = (id) => {
        setAccountPrimaryMutation.mutate(id, {
            onSuccess: () => { refetch(); handleClose() },
            onError: (error) => console.log(error)
        })
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

    const DropDown = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => setVisibleId(null)}
            >
                <Pressable style={styles.overlay} onPress={() => setVisibleId(null)} >
                    <View style={{
                        position: 'absolute',
                        top: dropdownPosition.y - 25,
                        left: dropdownPosition.x - 190,
                        backgroundColor: isDarkMode ? '#414141' : '#ebeaea',
                        borderRadius: 2,
                        paddingVertical: 10,
                        elevation: 10,
                        zIndex: 99
                    }}>
                        <TouchableOpacity
                            onPress={() => { handleSetPrimary(id); handleClose(); }}
                            style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                        >
                            <Text style={{ fontSize: 16, color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Marcar como principal</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                handleClose();
                                navigation.navigate('EditAccount', { accountId: id });
                            }}
                            style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                        >
                            <Text style={{ fontSize: 16, color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Editar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => { setIsOpen(true); handleClose(); }}
                            style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                        >
                            <Text style={{ fontSize: 16, color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Apagar</Text>
                        </TouchableOpacity>
                        <DangerModal
                            open={isOpen}
                            setRefreshing={setRefreshing}
                            setOpen={setIsOpen}
                            onPress={() => showNotif()}
                        />
                    </View>
                </Pressable>
            </Modal>
        )
    }

    return (

        <>
            {isVisible && <DropDown />}
            <AccountCard >
                <IconCard color={color}>
                    <MaterialIcons
                        name={icon}
                        size={24} color={textColor}
                    />
                </IconCard>
                <TextContainer>
                    <Title color={textColor}>{name}</Title>
                    {isPrimary && (
                        <MaterialIcons
                            name="star" size={24}
                            color={textColor}
                        />
                    )}
                </TextContainer>
                <InfoView>
                    <Balance color={textColor}>{value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</Balance>
                    {!hideOption && (
                        <TouchableOpacity ref={moreButtonRef} onPress={handleToggleDropdown}>
                            <MaterialIcons
                                name="more-vert" size={24}
                                color={textColor}
                            />
                        </TouchableOpacity>)}
                </InfoView>
            </AccountCard>
        </>
    )
}

const styles = StyleSheet.create({
    dropdown: {
        position: 'absolute',
        top: 0,
        width: 200,
        right: 20,
        elevation: 10,
        height: 'auto',
        borderRadius: 5,
        zIndex: 1,
    },
    overlay: {
        flex: 1
    }
})