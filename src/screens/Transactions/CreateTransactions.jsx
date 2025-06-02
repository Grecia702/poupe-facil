import { StyleSheet, Text, View, TouchableOpacity, Modal, FlatList, Platform, Switch, ScrollView } from 'react-native'
import React, { useState, useEffect, useContext, useLayoutEffect } from 'react'
import CATEGORIAS from '@utils/categorias';
import CategoriasReceitas from '@utils/categoriasReceitas';
import { MaterialIcons } from '@expo/vector-icons'
import { useToast } from 'react-native-toast-notifications';
import { useNavigation, useRoute } from '@react-navigation/native'
import { colorContext } from '@context/colorScheme';
import ActionButtons from '@components/actionButtons';
import api from '@context/axiosInstance'
import CustomInput from '@components/customInput';
import { useTransactionAuth } from '@context/transactionsContext';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import New from '@screens/New'
import UploadImageScreen from '../New';

const CreateTransactions = () => {
    const route = useRoute()
    const { tipo } = route.params
    const [selected, setSelected] = useState({ categoria: tipo === 'despesa' ? CATEGORIAS["Outros"] : CategoriasReceitas["Outros"], account: null, natureza: 'Variavel', recurrence_period: 'Mensal' });
    const [visible, setVisible] = useState({ categoria: false, account: false, natureza: false, recurring: false });
    const date = new Date();
    const [fields, setFields] = useState({ valor: 0, data_transacao: date, categoria: tipo === 'despesa' ? CATEGORIAS["Outros"].label : CategoriasReceitas["Outros"].label, natureza: selected.natureza, recorrente: false, tipo: tipo });
    const [accountData, setAccountData] = useState([{ id: '', nome: '', icone: '' }])
    const valorFormatado = (fields.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
    const { createTransactionMutation } = useTransactionAuth();
    const { isDarkMode } = useContext(colorContext);
    const navigation = useNavigation();
    const toast = useToast();
    const [show, setShow] = useState(false);
    const toggleSwitch = () => setFields(prev => ({
        ...prev,
        recorrente: !prev.recorrente
    }));
    const onChange = (event, selectedDate) => {
        setShow(Platform.OS === 'ios');
        if (selectedDate) {
            setFields({ ...fields, data_transacao: selectedDate.toISOString() });
        }
    };

    useLayoutEffect(() => {
        let title;
        switch (tipo) {
            case 'despesa':
                title = 'Registrar Despesa';
                break;
            case 'receita':
                title = 'Registrar Receita';
                break;
        }
        navigation.setOptions({
            title,
            headerTintColor: isDarkMode ? '#ccc' : '#333',
        });
    }, [navigation, tipo, isDarkMode]);

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
        createTransactionMutation.mutate(fields, {
            onSuccess: () => {
                toastSuccess();
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

    const handleChange = (text) => {
        const clean = text.replace(/\D/g, '');
        const valor = parseFloat(clean) / 100;
        setFields({ ...fields, valor: isNaN(valor) ? 0 : valor });
    };

    console.log(fields)

    return (

        <ScrollView style={[styles.container, { backgroundColor: isDarkMode ? '#121212' : '#e5e5ea' }]} contentContainerStyle={{ gap: 12, paddingBottom: 48 }}>
            <CustomInput
                description={tipo === 'despesa' ? 'Nome da despesa*' : 'Nome da receita*'}
                type={'default'}
                value={fields.nome_transacao}
                onChangeText={(text) => setFields({ ...fields, nome_transacao: text })}
                placeholder={tipo === 'despesa' ? "Ex.: Ifood, Uber, Conta de luz..." : "Ex.: Salário, Investimentos, Vendas..."}
                required
            />
            <CustomInput
                description={'Valor*'}
                type={'decimal-pad'}
                value={valorFormatado}
                onChangeText={handleChange}
                placeholder={'Digite o valor...'}
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
                    value={new Date(fields.data_transacao)}
                    mode="date"
                    display="default"
                    onChange={onChange}

                />
            )}
            <Text style={{ color: isDarkMode ? '#ccc' : "#333", fontSize: 16, fontWeight: '500' }}>Categorias</Text>
            <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(prev => ({ ...prev, categoria: true }))}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: selected.categoria?.color, borderRadius: 30, padding: 5 }}>
                            <MaterialIcons name={selected.categoria?.icon} color={'#333'} size={24} />
                        </View>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : "#333" }]}>
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
                                data={Object.values(tipo === 'despesa' ? CATEGORIAS : CategoriasReceitas)}
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
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#ccc' : "#333" }]}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5, }}>

                <Text style={{ color: isDarkMode ? '#ccc' : "#333", fontSize: 16, fontWeight: '500' }}>
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
                            <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : "#333" }]}>{selected.account?.nome}</Text>
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
                                        <View style={{ backgroundColor: '#ccc', borderRadius: 30, padding: 8 }}>
                                            <MaterialIcons name={item?.icone} size={24} color={"#222"} />
                                        </View>
                                        <Text style={[styles.optionText, { color: isDarkMode ? '#ccc' : "#333" }]}>{item?.nome_conta}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            <View style={styles.selectorRow}>
                <Text style={{ color: isDarkMode ? '#ccc' : "#333", fontSize: 16, fontWeight: '500' }}>Natureza</Text>
                <TouchableOpacity
                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                    onPress={() => setVisible(prev => ({ ...prev, natureza: true }))}
                >
                    <View style={styles.dropdown}>
                        <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : "#333" }]}>{selected?.natureza}</Text>
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
                                <Text style={{ color: isDarkMode ? '#ccc' : "#333" }}>Fixa</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setSelected(prev => ({ ...prev, natureza: 'Varíavel' }))
                                    setFields(prev => ({ ...prev, natureza: 'Varíavel', recorrente: false, frequencia_recorrencia: null }));
                                    setVisible(prev => ({ ...prev, natureza: false }))
                                }}
                            >
                                <Text style={{ color: isDarkMode ? '#ccc' : "#333" }}>Variavel</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>

            {selected?.natureza === "Fixa" &&
                (
                    <>
                        <View style={styles.selectorRow}>
                            <Text style={{ width: 60, color: isDarkMode ? '#ccc' : "#333", fontSize: 16, fontWeight: '500' }}>Período</Text>
                            <>
                                <TouchableOpacity
                                    style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}
                                    onPress={() => setVisible(prev => ({ ...prev, recurring: true }))}
                                >
                                    <View style={styles.dropdown}>
                                        <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : "#333" }]}>
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
                            <Text style={{ color: isDarkMode ? "#EEE" : "#222", fontSize: 16, fontWeight: '500' }}>Recorrente</Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#3d74d3' }}
                                thumbColor={fields.recorrente ? '#b1b1b1' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={fields.recorrente}
                            />
                        </View>
                    </>
                )
            }
            <Text style={{ color: isDarkMode ? '#ccc' : "#333", fontSize: 16, fontWeight: '500', marginTop: 16 }}>
                Ler Comprovante
            </Text>
            <View style={{ borderRadius: 10, borderWidth: 1, padding: 10, backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }}>
                <UploadImageScreen
                    fields={fields}
                    setFields={setFields}
                    selected={selected}
                    setSelected={setSelected}
                    categorias={CATEGORIAS}
                />
            </View>
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => handleCreateTransaction()}
                cancelLabel="Voltar"
                createLabel="Criar"
                cancelColor="#8d8d8d"
            />
        </ScrollView>
    )
}

export default CreateTransactions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
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
    selectorText: { marginLeft: 10, fontSize: 16 },
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