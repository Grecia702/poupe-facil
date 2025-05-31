import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { ACCOUNT_ICONS } from '../../utils/accountIcons';
import { MaterialIcons } from '@expo/vector-icons'
import api from '@context/axiosInstance'
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import ActionButtons from '@components/actionButtons';
import CustomInput from '@components/customInput';
import { useContasAuth } from '@context/contaContext';
import CustomModal from '@components/customModal';

const EditAccount = () => {
    const [dadosAPI, setDadosAPI] = useState({})
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [visible, setVisible] = useState(false);
    const { isDarkMode } = useContext(colorContext);
    const [fields, setFields] = useState({});
    const route = useRoute();
    const navigation = useNavigation();
    const toast = useToast();
    const { accountId } = route.params;
    const { updateAccountMutation, refetch } = useContasAuth();
    const [formatado, setFormatado] = useState(null);

    const searchAccount = async (id) => {
        try {
            const { data } = await api.get(`/profile/account/${id}`);
            setDadosAPI(data)
            setFormatado((Math.abs(data[0]?.saldo)).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
            setSelectedIcon(data[0]?.icone)
        } catch (err) {
            console.err('Erro ao buscar transação por ID:', err);
        }
    };

    useEffect(() => {
        searchAccount(accountId)
    }, [accountId]);


    const icon_names = {
        'account-balance': "Conta Bancaria",
        'account-balance-wallet': "Carteira",
        'lock': "Reserva de emergência",
        'credit-card': "Cartão de crédito",
    }


    const handleEditAccount = () => {
        if (fields.saldo === '') {
            errorToast("Insira um saldo válido")
            return
        }

        if (fields.saldo <= 0) {
            errorToast("Valor não pode ser menor ou igual a zero")
            return
        }
        const updateData = {
            id: dadosAPI[0]?.id,
            ...fields
        }
        updateAccountMutation.mutate(updateData, {
            onSuccess: () => {
                toastSuccess()
                refetch();
            },
            onError: (error) => toastError(error),
        });
    };

    const toastSuccess = () => {
        toast.show('Conta atualizada com sucesso', {
            type: 'success',
            duration: 1500,
        })
        navigation.goBack();
    }

    const toastError = (message) => {
        toast.show(`${message}`, {
            type: 'error',
            duration: 1500,
        })
    }


    const handleChange = (field, text) => {
        const clean = text.replace(/\D/g, '');
        const valor = parseFloat(clean) / 100;
        setFields({ ...fields, [field]: isNaN(valor) ? 0 : valor });
        const f = (!isNaN(valor) ? valor : 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        });
        setFormatado(f);
    };

    console.log(fields)

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '	#e5e5ea' }]}>
            <CustomInput
                description={'Nome da conta*'}
                type={'default'}
                value={fields.nome_conta}
                onChangeText={(text) => setFields({ ...fields, nome_conta: text })}
                placeholder={`${dadosAPI[0]?.nome_conta}`}
                required
            />
            <CustomInput
                description={'Saldo Inicial*'}
                type={'numeric-pad'}
                value={`${formatado}`}
                onChangeText={(text) => handleChange('saldo', text)}
                placeholder={`${formatado}`}
                required
            />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : '#333' }]}>Tipo</Text>
                <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                    <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
                        <View style={styles.iconWrapper}>
                            <View style={{ backgroundColor: "#BBB", borderRadius: 30, padding: 8 }}>
                                <MaterialIcons name={selectedIcon || 'account-balance'} size={24} color={"#666"} />
                            </View>
                            <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>
                                {icon_names[selectedIcon] || 'account-balance-wallet'}
                            </Text>
                        </View>
                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>

                <CustomModal visible={visible} setVisible={setVisible}>
                    <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                        {ACCOUNT_ICONS.map((item, index) => {
                            return (
                                <TouchableOpacity
                                    style={styles.option}
                                    key={index}
                                    onPress={() => {
                                        setSelectedIcon(item.icon);
                                        setFields({ ...fields, icone: item.icon });
                                        setVisible(false);
                                    }}
                                >
                                    <View key={index} style={{ backgroundColor: "#DDD", borderRadius: 30, padding: 8 }}>
                                        <MaterialIcons name={item.icon} size={24} color={"#666"} />
                                    </View>
                                    <Text style={[styles.optionText, { color: isDarkMode ? '#DDD' : "#333" }]}>{item.label}</Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                </CustomModal>
            </View>
            <CustomInput
                description={'Descrição (opcional)'}
                type={'default'}
                value={fields.desc_conta}
                placeholder={'Insira uma descrição...'}
                onChangeText={(text) => setFields({ ...fields, desc_conta: text })}
                height={100}
            />
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => handleEditAccount()}
                cancelLabel="Voltar"
                createLabel="Atualizar"
                cancelColor="#8d8d8d"
            />
        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    modal: {
        borderRadius: 10,
        padding: 20,
    },
    buttonInput: {
        minWidth: 150,
        padding: 5,
        borderRadius: 10,
        borderWidth: 1,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        marginLeft: 8
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#999',
        borderRadius: 8,
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
    },
    selectorText: {
        fontSize: 16,
        fontWeight: '600'
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
})