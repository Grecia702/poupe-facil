
import React, { useState, useContext } from 'react'
import { Pressable, View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { AccountCard, Balance, IconCard, InfoView, TextContainer, Title } from './styles'
import { MaterialIcons } from '@expo/vector-icons'
import { TouchableOpacity } from "react-native";
import { useContasAuth } from '@context/contaContext';
import { colorContext } from '@context/colorScheme'
import { useToast } from 'react-native-toast-notifications';
import DangerModal from '@components/dangerModal';
import { set } from 'date-fns';


export default function Account({ name, value, icon, color, textColor, isVisible, setVisibleId, setRefreshing, id, hideOption, isPrimary }) {
    const { isDarkMode } = useContext(colorContext)
    const navigation = useNavigation();
    const [isOpen, setIsOpen] = useState(false)
    const toast = useToast();
    const { deleteConta, refetch, setAccountPrimaryMutation } = useContasAuth();
    const handleToggleDropdown = () => {
        setVisibleId(isVisible ? null : id);
    };
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

                <View style={[styles.dropdown, { backgroundColor: isDarkMode ? '#3b3b3b' : '#ebeaea', }]}>
                    <TouchableOpacity
                        onPress={() => handleSetPrimary(id)}
                        style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                    >
                        <Text style={{ fontSize: 16, color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Marcar como principal</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('EditAccount', { accountId: id })}
                        style={{ paddingVertical: 15, paddingHorizontal: 15 }}
                    >
                        <Text style={{ fontSize: 16, color: isDarkMode ? '#EEE' : '#222', textAlign: 'left' }}>Editar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsOpen(prev => !prev)}
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
            </>
        );
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
                    {!hideOption && (<TouchableOpacity onPress={handleToggleDropdown}>
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
    }
})