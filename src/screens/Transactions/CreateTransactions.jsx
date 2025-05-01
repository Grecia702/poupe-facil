import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { CATEGORIAS } from '../../utils/categorias';
import { MaterialIcons } from '@expo/vector-icons'
import { useTransactionAuth } from '@context/transactionsContext';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import api from '@context/axiosInstance'
import { format } from 'date-fns';

const CreateTransactions = () => {
    const agora = format(new Date(), 'dd/MM/yyyy');
    const [selected, setSelected] = useState({ categoria: CATEGORIAS[0], account: null, type: 'Fixa' });
    const [visible, setVisible] = useState({ categoria: false, account: false, type: false });
    const [fields, setFields] = useState({
        valor: '',
        valorFormatted: '',
        categoria: CATEGORIAS[0].label,
        natureza: 'Fixa',
        data: `${agora}`,
        id_contabancaria: ''
    });
    const [accountData, setAccountData] = useState([{ id: '', nome: '', icone: '' }])

    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext);
    const { createTransactionMutation } = useTransactionAuth()
    const toast = useToast();


    const searchAccount = async () => {
        try {
            const { data } = await api.get(`/profile/account/`);
            setAccountData(data)
            setSelected({ ...selected, account: { id: data[0]?.id, nome: data[0]?.nome_conta, icone: data[0]?.icone } })
            setFields({ ...fields, id_contabancaria: data[0]?.id })
        } catch (err) {
            console.err('Erro ao buscar transação por ID:', err);
        }
    };

    useEffect(() => {
        searchAccount()
    }, []);

    const handleCreateTransaction = () => {
        if (fields.valor === '') {
            errorToast("Insira um valor válido")
            return
        }
        createTransactionMutation.mutate(fields, {
            onSuccess: () => showNotif(),
            onError: (error) => errorToast(error),
        });

    }

    const showNotif = () => {
        toast.show('Transação criada com sucesso', {
            type: 'success',
            duration: 1500,
        })
        setTimeout(() => {
            navigation.replace('Transactions');
        }, 50)

    }

    const errorToast = (message) => {
        toast.show(`${message}`, {
            type: 'error',
            duration: 1500,
        })
    }

    useEffect(() => {
        console.log(fields)
    }, [selected])



    // Regex demoniaco pra conversão de numero em valor moeda
    const handleCurrencyInput = (text) => {
        const numeric = text.replace(/\D/g, '');
        const number = (Number(numeric) / 100).toFixed(2);

        const formatted = number
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        setFields({
            ...fields,
            valorFormatted: formatted,           // Enfeite visual
            valor: parseFloat(number) // Valor real para enviar
        });
    };


    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : '#CCC' }]}>
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Valor *</Text>
                <TextInput
                    keyboardType="decimal-pad"
                    placeholder={"R$0,00"}
                    style={{ flex: 1, color: isDarkMode ? '#DDD' : "#333" }}
                    value={fields.valorFormatted}
                    onChangeText={(text) => handleCurrencyInput(text)}
                    placeholderTextColor={isDarkMode ? '#DDD' : "#333"}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Categorias</Text>

                <TouchableOpacity style={styles.selector} onPress={() => setVisible({ ...visible, categoria: true })}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: selected.categoria.color, borderRadius: 30, padding: 5 }}>
                            <MaterialIcons name={selected.categoria.icon} color={'#333'} size={24} />
                        </View>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected.categoria.label}</Text>
                    </View>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>

                </TouchableOpacity>

                <Modal visible={visible.categoria} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible({ ...visible, categoria: false })}>
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={CATEGORIAS}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelected({ ...selected, categoria: item });
                                            setFields({ ...fields, categoria: item.label });
                                            setVisible({ ...visible, categoria: false });
                                        }}
                                    >
                                        <View style={{ backgroundColor: `${item.color}`, borderRadius: 30, padding: 8 }}>
                                            <MaterialIcons name={item.icon} size={24} color={"#222"} />
                                        </View>
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#DDD' : "#333" }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Data</Text>
                <TextInput
                    placeholder={agora}
                    placeholderTextColor={isDarkMode ? '#DDD' : "#333"}
                />
            </View>
            <View style={styles.separator} />

            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Conta Bancaria</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible({ ...visible, account: true })}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: "#BBB", borderRadius: 30, padding: 5 }}>
                            <MaterialIcons name={selected.account?.icone} color={isDarkMode ? '#444' : "#333"} size={24} />
                        </View>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected.account?.nome}</Text>

                    </View>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.account} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay}
                        onPress={() => setVisible({ ...visible, account: false })}
                    >
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={accountData}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelected({ ...selected, account: { id: item.id, nome: item.nome_conta, icone: item.icone } })
                                            setFields({ ...fields, id_contabancaria: item.id });
                                            setVisible({ ...visible, account: false })
                                        }}
                                    >
                                        <View style={{ backgroundColor: '#DDD', borderRadius: 30, padding: 8 }}>
                                            <MaterialIcons name={item?.icone} size={24} color={"#222"} />
                                        </View>
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#DDD' : "#333" }]}>{item?.nome_conta}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5, alignItems: 'center' }}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Natureza</Text>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }} onPress={() => setVisible({ ...visible, type: true })}>
                    <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.type}</Text>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.type} transparent animationType="slide">
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#00000066',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                    }}
                        onPress={() => setVisible({ ...visible, type: false })}>
                        <View style={{ gap: 5, alignItems: 'center', borderRadius: 5, padding: 20, width: 'auto', backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected({ ...selected, type: 'Fixa' })
                                    setFields({ ...fields, natureza: 'Fixa' });
                                    setVisible({ ...visible, type: false })
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Fixa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected({ ...selected, type: 'Varíavel' })
                                    setFields({ ...fields, natureza: 'Varíavel' });
                                    setVisible({ ...visible, type: false })
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Variavel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            <View style={styles.separator} />
            <TouchableOpacity onPress={handleCreateTransaction} style={styles.button}>
                <Text style={{ color: 'white', fontWeight: 500 }}>Criar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateTransactions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    separator: {
        height: 2,
        marginHorizontal: -30,
        backgroundColor: '#111'
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#b82c2c',
        padding: 10,
        alignSelf: 'flex-end',
        borderRadius: 15
    },
    label: {
        marginBottom: 10
    },
    modal: {
        borderRadius: 10,
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
    selector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: '#999',
        padding: 5,
        borderRadius: 8,
    },
    selectorText: { marginLeft: 10 },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
})