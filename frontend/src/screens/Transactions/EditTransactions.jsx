import { StyleSheet, Text, View, Platform, Modal, TouchableOpacity, FlatList, Switch } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import api from '@context/axiosInstance'
import CATEGORIAS from '@utils/categorias';
import CATEGORIAS_RECEITAS from '@utils/categoriasReceitas';
import { MaterialIcons } from '@expo/vector-icons'
import { useTransactionByID } from '@hooks/usePosts';
import { useToast } from 'react-native-toast-notifications';
import { useContasAuth } from '@context/contaContext';
import { useNavigation } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import ActionButtons from '@components/actionButtons';
import CustomInput from '@components/customInput';
import { useTransactionAuth } from '@context/transactionsContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const EditTransactions = () => {
    const route = useRoute();
    const { transactionId, tipo, data } = route.params;
    const { isDarkMode } = useContext(colorContext);
    const date = data?.data_transacao ? new Date(data.data_transacao) : new Date();
    const [formatado, setFormatado] = useState(null);
    const [visible, setVisible] = useState({ categoria: false, account: false, natureza: false, type: false, recurring: false });
    const { dadosContas: accountData } = useContasAuth()
    const [selected, setSelected] = useState({ ...data, categoria: tipo === 'despesa' ? CATEGORIAS[data.categoria] : CATEGORIAS_RECEITAS[data.categoria], });
    const [show, setShow] = useState(false);
    const [fields, setFields] = useState({ data_transacao: date, nome_transacao: data.nome_transacao });
    const navigation = useNavigation();
    const { updateTransactionMutation } = useTransactionAuth();
    const toast = useToast();
    const [isAtivado, setIsAtivado] = useState(data?.recorrente);
    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            setFields({ ...fields, data_transacao: selectedDate });
        }
    };
    const toggleSwitch = () => {
        setFields(prevFields => ({
            ...prevFields,
            recorrente: !prevFields.recorrente
        }));
    };

    console.log(selected.categoria)


    const recurrence_period = [
        'Diario', 'Semanal', 'Quinzenal',
        'Mensal', 'Bimestral', 'Trimestral',
        'Quadrimestral', 'Semestral', 'Anual'
    ]

    useEffect(() => {
        setSelected({
            ...data,
            categoria: tipo === 'despesa' ? CATEGORIAS[data?.categoria] : CATEGORIAS_RECEITAS[data?.categoria],
            recurrence_period: recurrence_period[3]
        })
        setFormatado(Math.abs(data?.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
    }, [data, accountData])


    const handleEditTransaction = async () => {
        if (fields.nome_transacao === '') {
            errorToast("Insira um nome para a transação")
            return
        }
        if (fields.valor === '') {
            errorToast("Insira um valor válido")
            return
        }

        if (fields.valor <= 0) {
            errorToast("Valor não pode ser menor ou igual a zero")
            return
        }
        const updateData = {
            id: data?.transaction_id,
            ...fields
        }
        updateTransactionMutation.mutate(updateData, {
            onSuccess: () => {
                toastSuccess();
            },
            onError: (error) => errorToast(error),
        });

    }

    const toastSuccess = () => {
        toast.show('Transação atualizada com sucesso', {
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
                description={'Nome da despesa*'}
                type={'default'}
                value={fields.nome_transacao}
                onChangeText={(text) => setFields({ ...fields, nome_transacao: text })}
                placeholder={`${data?.nome_transacao}`}
                required
            />
            <CustomInput
                description={'Valor*'}
                type={'numeric-pad'}
                value={`${formatado}`}
                onChangeText={(text) => handleChange('valor', text)}
                placeholder={`${formatado}`}
                required
            />
            <CustomInput
                description={'Data de transação'}
                type={'date'}
                value={fields.data_transacao}
                placeholder={format(fields.data_transacao, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                onPress={() => setShow(true)}
            />
            {show && (
                <DateTimePicker
                    value={fields.data_transacao}
                    mode="date"
                    display="default"
                    onChange={onChange}

                />
            )}
            <Text style={{ fontSize: 16, fontWeight: 500, color: isDarkMode ? '#DDD' : "#333" }}>Categorias</Text>
            <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(prev => ({ ...prev, categoria: true }))}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: selected.categoria?.color, borderRadius: 60, padding: 5 }}>
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
                                data={tipo === 'despesa' ? Object.values(CATEGORIAS) : Object.values(CATEGORIAS_RECEITAS)}
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
            <View style={styles.selectorRow}>
                <Text style={{ fontSize: 16, fontWeight: 500, color: isDarkMode ? '#DDD' : "#333" }}>Tipo</Text>
                <TouchableOpacity
                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                    onPress={() => setVisible(prev => ({ ...prev, type: true }))}
                >
                    <View style={styles.dropdown}>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#DDD' : "#333" }]}>{selected?.tipo}</Text>
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
                                    setSelected(prev => ({ ...prev, tipo: 'despesa' }))
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
                <Text style={{ fontSize: 16, fontWeight: 500, color: isDarkMode ? '#DDD' : "#333" }}>Natureza</Text>
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
                                    setFields(prev => ({ ...prev, natureza: 'Fixa', recorrente: true, frequencia_recorrencia: selected?.recurrence_period }));
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
                            <Text style={{ fontSize: 16, fontWeight: 500, width: 60, color: isDarkMode ? '#DDD' : "#333" }}>
                                Período
                            </Text>
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
                                                        <Text style={{ paddingLeft: 5, paddingRight: 20, color: isDarkMode ? '#EEE' : '#222' }}>
                                                            {item}
                                                        </Text>

                                                    </TouchableOpacity>
                                                )
                                            })}
                                        </View>
                                    </TouchableOpacity>
                                </Modal>
                            </>
                        </View>

                        <View style={styles.switch}>
                            <Text style={{ fontSize: 16, fontWeight: 500, color: isDarkMode ? "#EEE" : "#222" }}>
                                Recorrente
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isAtivado ? '#c4c4c4' : '#f4f3f4'}
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
                onCreate={() => handleEditTransaction()}
                cancelLabel="Voltar"
                createLabel="Atualizar"
                cancelColor="#8d8d8d"
            />
        </View>
    )
}

export default EditTransactions

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