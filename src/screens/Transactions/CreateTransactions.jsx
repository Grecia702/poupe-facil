import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList, Switch } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import { CATEGORIAS } from '../../utils/categorias';
import { MaterialIcons } from '@expo/vector-icons'
import { useTransactionAuth } from '@context/transactionsContext';
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import api from '@context/axiosInstance'
import { parse, isValid, format } from 'date-fns';
import { useQueryClient } from '@tanstack/react-query';

const CreateTransactions = () => {
    const agora = format(new Date(), 'dd/MM/yyyy');
    const [selected, setSelected] = useState({ categoria: CATEGORIAS[0], account: null, natureza: 'Variavel', type: 'Despesa', recurrence_period: 'Mensal' });
    const [visible, setVisible] = useState({ categoria: false, account: false, natureza: false, type: false, recurring: false });
    const [isAtivado, setIsAtivado] = useState(false);
    const [accountData, setAccountData] = useState([{ id: '', nome: '', icone: '' }])
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext);
    const { createTransactionMutation, refetch } = useTransactionAuth()
    const toast = useToast();
    const queryClient = useQueryClient();
    const toggleSwitch = () => setIsAtivado(previousState => !previousState);
    const [fields, setFields] = useState({
        valor: '',
        valorFormatted: '',
        categoria: CATEGORIAS[0].label,
        natureza: selected.natureza,
        data_transacao: agora,
        id_contabancaria: '',
        tipo: selected.type,
        recorrente: false,
        frequencia_recorrencia: null,
    });


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

    const isDateDDMMYYYY = (str) => {
        const parsed = parse(str, 'dd/MM/yyyy', new Date());
        return isValid(parsed) && format(parsed, 'dd/MM/yyyy') === str;
    };

    const handleCreateTransaction = () => {
        if (fields.valor === '') {
            errorToast("Insira um valor válido")
            return
        }

        if (!isDateDDMMYYYY(fields.data_transacao)) {
            errorToast("Insira uma data válida (DD/MM/YYYY)")
            return
        }
        createTransactionMutation.mutate(fields, {
            onSuccess: () => {
                queryClient.invalidateQueries(['transaction_id']);
                refetch().then(() => {
                    showNotif()
                })
            },
            onError: (error) => errorToast(error),
        });

    }

    const showNotif = () => {
        toast.show('Transação criada com sucesso', {
            type: 'success',
            duration: 1500,
        })
        setTimeout(() => {
            navigation.goBack();
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

        setFields(prev => ({
            ...prev,
            valorFormatted: formatted,
            valor: parseFloat(number)
        }));
    };

    const handleDateInput = (text) => {
        const numeric = text.replace(/\D/g, '').slice(0, 8);
        let formatted = numeric;
        if (numeric.length >= 5) {
            formatted = `${numeric.slice(0, 2)}/${numeric.slice(2, 4)}/${numeric.slice(4)}`;
        } else if (numeric.length >= 3) {
            formatted = `${numeric.slice(0, 2)}/${numeric.slice(2)}`;
        }

        setFields(prev => ({
            ...prev,
            data_transacao: formatted
        }));
    };



    return (

        <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : '#CCC' }]}>

            {/* VALOR DA TRANSAÇÃO */}

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



            {/* DATA DE CRIAÇÃO */}

            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Data</Text>
                <TextInput
                    style={{ flex: 1, color: isDarkMode ? '#DDD' : "#333" }}
                    placeholder={agora}
                    placeholderTextColor={isDarkMode ? '#DDD' : "#333"}
                    value={fields.data_transacao}
                    onChangeText={(text) => handleDateInput(text)}
                />
            </View>
            <View style={styles.separator} />

            {/* CATEGORIAS DE TRANSAÇÃO */}

            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Categorias</Text>

                <TouchableOpacity style={styles.selector} onPress={() => setVisible(prev => ({ ...prev, categoria: true }))}>
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
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(prev => ({ ...prev, categoria: false }))}>
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={CATEGORIAS}
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
            <View style={styles.separator} />


            {/* CONTA BANCARIA ATRELADA  */}

            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5, }}>

                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Conta Bancaria</Text>
                <TouchableOpacity style={[styles.selector]} onPress={() => setVisible(prev => ({ ...prev, account: true }))}>
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
            <View style={styles.separator} />
            {/* TIPO DE TRANSAÇÃO  */}

            <View style={styles.selectorRow}>
                <Text style={{ width: 60, color: isDarkMode ? '#DDD' : "#333" }}>Tipo</Text>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setVisible(prev => ({ ...prev, type: true }))}>

                    <View style={styles.dropdown}>

                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.type}</Text>

                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.type} transparent animationType="fade">
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#00000066',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                    }}
                        onPress={() => setVisible(prev => ({ ...prev, type: false }))}>
                        <View style={{ gap: 5, alignItems: 'center', borderRadius: 5, padding: 20, width: 'auto', backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, type: 'Despesa' }))
                                    setFields(prev => ({ ...prev, tipo: 'Despesa' }));
                                    setVisible(prev => ({ ...prev, type: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Despesa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, type: 'Receita' }))
                                    setFields(prev => ({ ...prev, tipo: 'Receita' }));
                                    setVisible(prev => ({ ...prev, type: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#DDD' : "#333" }}>Receita</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.separator} />

            {/* NATUREZA DA TRANSAÇÃO  */}

            <View style={styles.selectorRow}>
                <Text style={{ width: 60, color: isDarkMode ? '#DDD' : "#333" }}>Natureza</Text>
                <TouchableOpacity style={{ flex: 1 }} onPress={() => setVisible(prev => ({ ...prev, natureza: true }))}>

                    <View style={styles.dropdown}>

                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.natureza}</Text>

                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </View>
                </TouchableOpacity>

                <Modal visible={visible.natureza} transparent animationType="fade">
                    <TouchableOpacity style={{
                        flex: 1,
                        backgroundColor: '#00000066',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: 20,
                    }}
                        onPress={() => setVisible(prev => ({ ...prev, natureza: false }))}>
                        <View style={{ gap: 5, alignItems: 'center', borderRadius: 5, padding: 20, width: 'auto', backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
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
            <View style={styles.separator} />



            {/* Período Recorrencia */}

            {selected?.natureza === "Fixa" &&
                (
                    <>
                        <View style={styles.selectorRow}>
                            <Text style={{ width: 60, color: isDarkMode ? '#DDD' : "#333" }}>Período</Text>

                            <>
                                <TouchableOpacity style={{ flex: 1 }} onPress={() => setVisible(prev => ({ ...prev, recurring: true }))}>

                                    <View style={styles.dropdown}>
                                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.recurrence_period}</Text>
                                        <View>
                                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                                        </View>
                                    </View>
                                </TouchableOpacity>

                                <Modal visible={visible.recurring} transparent animationType="slide">
                                    <TouchableOpacity style={{
                                        flex: 1,
                                        backgroundColor: '#00000066',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: 20,
                                    }}
                                        onPress={() => setVisible(prev => ({ ...prev, recurring: false }))}>
                                        <View style={{ borderRadius: 5, backgroundColor: isDarkMode ? '#333' : '#EEE' }}>
                                            {recurrence_period.map((item, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <TouchableOpacity
                                                            style={{ flexDirection: 'row', padding: 10 }}
                                                            onPress={() => {
                                                                setSelected(prev => ({ ...prev, recurrence_period: item }))
                                                                setFields(prev => ({ ...prev, frequencia_recorrencia: item }))
                                                                setVisible(prev => ({ ...prev, recurring: false }))
                                                            }}>
                                                            <Text style={{ paddingLeft: 5, paddingRight: 20, color: isDarkMode ? '#EEE' : '#222' }}>{item}</Text>

                                                        </TouchableOpacity>
                                                        {index !== recurrence_period.length - 1 && (
                                                            <View style={{ height: 2, backgroundColor: '#111' }} />
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            </>
                        </View>
                        <View style={styles.separator} />
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
                        <View style={styles.separator} />
                    </>
                )
            }

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
        backgroundColor: '#111',
        alignSelf: 'stretch',
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
    selectorRow: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5,
        alignItems: 'center'
    },
    dropdown: {
        paddingHorizontal: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    switch: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})