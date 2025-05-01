import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import { ACCOUNT_ICONS } from '../../utils/accountIcons';
import { MaterialIcons } from '@expo/vector-icons'
import api from '@context/axiosInstance'

const EditAccount = () => {
    const [dadosAPI, setDadosAPI] = useState({})
    const [selectedIcon, setSelectedIcon] = useState(null);
    const [visible, setVisible] = useState(false);
    const [fields, setFields] = useState({ saldo: '', nome_conta: '', tipo_conta: '', icone: '', desc_conta: '' });
    const route = useRoute();
    const { accountId } = route.params;

    const searchAccount = async (id) => {
        try {
            const { data } = await api.get(`/profile/account/${id}`);

            setDadosAPI(data)
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


    return (
        <View style={styles.container}>
            <View style={styles.input}>
                <Text>Nome</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={`${dadosAPI[0]?.nome_conta}` || ''} />
            </View>
            <View style={styles.separator} />
            <View style={styles.input}>
                <Text>Saldo</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={`R$${dadosAPI[0]?.saldo}` ?? 'R$0,00'} />
            </View>
            <View style={styles.separator} />
            <View style={styles.input}>
                <Text>Tipo</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={dadosAPI[0]?.tipo_conta ?? 'e.g., Conta Corrente'}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text>Ícone</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: "#BBB", borderRadius: 30, padding: 8 }}>
                            <MaterialIcons name={selectedIcon || 'account-balance'} size={24} color={"#666"} />
                        </View>
                        <Text style={styles.selectorText}>{icon_names[selectedIcon] || 'account-balance-wallet'}</Text>
                    </View>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="fade">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                        <View style={styles.modal}>
                            {ACCOUNT_ICONS.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelectedIcon(item.icon);
                                            setFields({ ...fields, icone: item.icon });
                                            setVisible(false);
                                        }}
                                    >
                                        <View key={index} style={{ backgroundColor: "#DDD", borderRadius: 30, padding: 8 }}>
                                            <MaterialIcons name={item.icon} size={24} color={"#666"} />
                                        </View>
                                        <Text style={styles.optionText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )
                            })}
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.separator} />
            <View style={styles.input}>
                <Text>Descrição</Text>
                <TextInput
                    placeholder={`${dadosAPI[0]?.desc_conta}` || 'Insira uma descrição'}
                />
            </View>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.button}>
                <Text style={{ color: 'white', fontWeight: 500 }}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCC',
        padding: 30,
        gap: 10,
    },
    separator: {
        height: 2,
        marginHorizontal: -30,
        backgroundColor: 'black'
    },
    input: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5
    }
    ,
    button: {
        backgroundColor: '#b82c2c',
        padding: 10,
        alignSelf: 'flex-end',
        borderRadius: 15
    },
    label: {
        marginBottom: 10
    },
    picker: {
        height: 'auto',
        width: '100%',
        backgroundColor: 'red'
    },
    result: {
        marginTop: 20, fontSize: 16
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#999',
        borderRadius: 8,
    },
    selectorText: {
        marginLeft: 10
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
    },
})