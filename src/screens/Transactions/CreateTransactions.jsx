import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Switch } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import CATEGORIAS from '@utils/categorias';
import { MaterialIcons } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import ActionButtons from '@components/actionButtons';
import api from '@context/axiosInstance'
import CustomInput from '@components/customInput';
import { useTransactionAuth } from '@context/transactionsContext';

const CreateTransactions = () => {
    const [selected, setSelected] = useState({ categoria: CATEGORIAS["Outros"], account: null, natureza: 'Variavel', type: 'despesa', recurrence_period: 'Mensal' });
    const [visible, setVisible] = useState({ categoria: false, account: false, natureza: false, type: false, recurring: false });
    const [fields, setFields] = useState({ valor: '', categoria: CATEGORIAS["Outros"].label, natureza: selected.natureza, id_contabancaria: '', tipo: selected.type, recorrente: false, frequencia_recorrencia: null, });
    const [accountData, setAccountData] = useState([{ id: '', nome: '', icone: '' }])
    const [formatado, setFormatado] = useState('R$ 0,00');
    const { useFilteredTransacoes, createTransactionMutation } = useTransactionAuth();
    const { refetch } = useFilteredTransacoes();
    const { isDarkMode } = useContext(colorContext);
    const navigation = useNavigation();
    const toast = useToast();
    const [isAtivado, setIsAtivado] = useState(false);
    const toggleSwitch = () => setIsAtivado(previousState => !previousState);


    const recurrence_period = [
        'Diario', 'Semanal', 'Quinzenal',
        'Mensal', 'Bimestral', 'Trimestral',
        'Quadrimestral', 'Semestral', 'Anual'
    ]

    const searchAccount = async () => {
        try {
            const { data } = await api.get(`/profile/account/`);
            setAccountData(data)
            setSelected(prev => ({ ...prev, account: { id: data[0]?.id, nome: data[0]?.nome_conta, icone: data[0]?.icone } }))
            setFields(prev => ({ ...prev, id_contabancaria: data[0]?.id }))
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
            onSuccess: () => {
                toastSuccess();
                refetch();
            },
            onError: (error) => toastError(error),
        });
    }

    const toastSuccess = () => {
        toast.show('Transação criada com sucesso', {
            type: 'success',
            duration: 1500,
        })
        navigation.goBack();
    }

    const errorToast = (message) => {
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

    return (

        <View style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '	#e5e5ea' }]}>
            <CustomInput
                description={'Valor*'}
                type={'numeric-pad'}
                value={formatado}
                onChangeText={(text) => handleChange('valor', text)}
                placeholder={'Digite o valor...'}
                required
            />
            <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Categorias</Text>
            <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(prev => ({ ...prev, categoria: true }))}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: selected.categoria?.color, borderRadius: 30, padding: 5 }}>
                            <MaterialIcons name={selected.categoria?.icon} color={'#333'} size={24} />
                        </View>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>
                            {selected.categoria?.label}
                        </Text>
                    </View>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>
                </TouchableOpacity>
                <Modal visible={visible.categoria} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(prev => ({ ...prev, categoria: false }))}>
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={Object.values(CATEGORIAS)}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelected(prev => ({ ...prev, categoria: item }));
                                            setFields(prev => ({ ...prev, categoria: item.label }));
                                            setVisible(prev => ({ ...prev, categoria: false }));
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

            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5, }}>

                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>
                    Conta Bancaria
                </Text>
                <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                    <TouchableOpacity
                        style={styles.selector}
                        onPress={() => setVisible(prev => ({ ...prev, account: true }))}
                    >
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
                </View>

                <Modal visible={visible.account} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay}
                        onPress={() => setVisible(prev => ({ ...prev, account: false }))}
                    >
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={accountData}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelected(prev => ({ ...prev, account: { id: item.id, nome: item.nome_conta, icone: item.icone } }))
                                            setFields(prev => ({ ...prev, id_contabancaria: item.id }));
                                            setVisible(prev => ({ ...prev, account: false }))
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

            <View style={styles.selectorRow}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Tipo</Text>
                <TouchableOpacity
                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                    onPress={() => setVisible(prev => ({ ...prev, type: true }))}
                >
                    <View style={styles.dropdown}>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.type}</Text>
                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.type} transparent animationType="fade">
                    <TouchableOpacity
                        style={styles.modalShort}
                        onPress={() => setVisible(prev => ({ ...prev, type: false }))}>
                        <View style={{ gap: 5, alignItems: 'center', borderRadius: 5, padding: 20, width: 'auto', backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, type: 'despesa' }))
                                    setFields(prev => ({ ...prev, tipo: 'despesa' }));
                                    setVisible(prev => ({ ...prev, type: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Despesa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, type: 'receita' }))
                                    setFields(prev => ({ ...prev, tipo: 'receita' }));
                                    setVisible(prev => ({ ...prev, type: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Receita</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            <View style={styles.selectorRow}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Natureza</Text>
                <TouchableOpacity
                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                    onPress={() => setVisible(prev => ({ ...prev, natureza: true }))}
                >
                    <View style={styles.dropdown}>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.natureza}</Text>
                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.natureza} transparent animationType="fade">
                    <TouchableOpacity
                        style={styles.modalShort}
                        onPress={() => setVisible(prev => ({ ...prev, natureza: false }))}>
                        <View style={{ padding: 16, borderRadius: 6, backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, natureza: 'Fixa' }))
                                    setFields(prev => ({ ...prev, natureza: 'Fixa', recorrente: true, frequencia_recorrencia: selected.recurrence_period }));
                                    setVisible(prev => ({ ...prev, natureza: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Fixa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, natureza: 'Varíavel' }))
                                    setFields(prev => ({ ...prev, natureza: 'Varíavel', recorrente: false, frequencia_recorrencia: null }));
                                    setVisible(prev => ({ ...prev, natureza: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Variavel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {selected?.natureza === "Fixa" &&
                (
                    <>
                        <View style={styles.selectorRow}>
                            <Text style={{ width: 60, color: isDarkMode ? '#DDD' : "#333" }}>Período</Text>
                            <>
                                <TouchableOpacity
                                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                                    onPress={() => setVisible(prev => ({ ...prev, recurring: true }))}
                                >
                                    <View style={styles.dropdown}>
                                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>
                                            {selected?.recurrence_period}
                                        </Text>
                                        <View>
                                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <Modal visible={visible.recurring} transparent animationType="slide">
                                    <TouchableOpacity
                                        style={styles.modalShort}
                                        onPress={() => setVisible(prev => ({ ...prev, recurring: false }))}>
                                        <View style={{ borderRadius: 5, backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                                            {recurrence_period.map((item, index) => {
                                                return (
                                                    <TouchableOpacity
                                                        key={index}
                                                        style={{ flexDirection: 'row', padding: 16 }}
                                                        onPress={() => {
                                                            setSelected(prev => ({ ...prev, recurrence_period: item }))
                                                            setFields(prev => ({ ...prev, frequencia_recorrencia: item }))
                                                            setVisible(prev => ({ ...prev, recurring: false }))
                                                        }}>
                                                        <Text style={{ paddingLeft: 5, paddingRight: 20, color: isDarkMode ? '#EEE' : '#222' }}>{item}</Text>

                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            </>
                        </View>

                        <View style={styles.switch}>
                            <Text style={{ color: isDarkMode ? "#EEE" : "#222" }}>Recorrente</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isAtivado ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isAtivado}
                            />
                        </View>
                    </>
                )
            }
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => handleCreateTransaction()}
                cancelLabel="Voltar"
                createLabel="Criar"
                cancelColor="#8d8d8d"
            />
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
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    button: {
        backgroundColor: '#2c8cb8',
        padding: 12,
        paddingHorizontal: 32,
        alignSelf: 'flex-end',
        borderRadius: 16,
        marginTop: 24,
    },
    buttonInput: {
        minWidth: 150,
        padding: 5,
        borderRadius: 10,
        borderWidth: 1,
    },
    modal: {
        borderRadius: 10,
        padding: 20,
    },
    modalShort: {
        flex: 1,
        backgroundColor: '#00000066',
        alignItems: 'center',
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
    selectorRow: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5,
        marginTop: 12,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    dropdown: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switch: {
        marginTop: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})