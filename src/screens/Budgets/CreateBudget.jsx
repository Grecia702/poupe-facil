import { StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, FlatList } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import ActionButtons from '@components/actionButtons';
import categorias from '../../utils/categorias.json';
import { useTransactionAuth } from '@context/transactionsContext';

const CreateBudget = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext);
    const [visible, setVisible] = useState(false);
    const toast = useToast();
    const { CreateBudgetMutation } = useTransactionAuth()
    const [fields, setFields] = useState({ quantia_limite: '', quantia_limiteFormatted: '', limites_categoria: {} });
    const [categoriasLimites, setCategoriasLimites] = useState(new Set());
    const [confirmAction, setConfirmAction] = useState(false)

    const handleCurrencyInput = (text, campo) => {
        const numeric = text.replace(/\D/g, '');
        const number = (Number(numeric) / 100).toFixed(2);

        const formatted = number
            .replace('.', ',')
            .replace(/\B(?=(\d{3})+(?!\d))/g, '.');

        if (campo) {
            setFields(prev => ({
                ...prev,
                limites_categoria: {
                    ...(prev.limites_categoria || {}),
                    [campo]: formatted,
                },
            }));
        } else {
            setFields(prev => ({
                ...prev,
                quantia_limite: formatted,
            }));
        }
    };


    console.log(fields)

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : '#CCC' }]}>
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text style={[styles.title, { color: '#cc5656' }]}>Período (mês e ano)*</Text>
                <TextInput
                    keyboardType="decimal-pad"
                    placeholder={"Maio de 2025"}
                    style={{ color: isDarkMode ? '#DDD' : "#333" }}
                    value={fields.valorFormatted}
                    onChangeText={(text) => handleCurrencyInput(text)}
                    placeholderTextColor={isDarkMode ? '#b9b6b6' : "#333"}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text style={[styles.title, { color: '#cc5656' }]}>Valor limite do orçamento*</Text>
                <TextInput
                    keyboardType="decimal-pad"
                    placeholder={"R$0,00"}
                    style={{
                        color: isDarkMode ? '#DDD' : "#333",
                    }}
                    value={fields.quantia_limite}
                    onChangeText={(text) => handleCurrencyInput(text)}
                    placeholderTextColor={isDarkMode ? '#b9b6b6' : "#333"}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text style={[styles.title, { marginBottom: 10, color: isDarkMode ? '#DDD' : "#333" }]}>Limites de categorias (opcional)</Text>
                {(categoriasLimites.size > 0 && confirmAction) && (
                    [...categoriasLimites].map(item => {
                        return (
                            <View key={item} style={styles.section}>
                                <Text style={{ minWidth: 200, color: isDarkMode ? '#DDD' : "#333" }}>{item}</Text>
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'flex-end',
                                    width: 160,
                                    gap: 10,
                                }}>
                                    <TextInput
                                        keyboardType="decimal-pad"
                                        placeholder={"R$0,00"}
                                        style={{
                                            color: isDarkMode ? '#DDD' : "#333",
                                            flex: 1,
                                            // backgroundColor: "#88252539",
                                            // textAlign: 'right'
                                        }}
                                        maxLength={20}
                                        value={fields.limites_categoria[item]}
                                        onChangeText={(text) => handleCurrencyInput(text, item)}
                                        placeholderTextColor={isDarkMode ? '#b9b6b6' : "#333"}
                                    />
                                    <TouchableOpacity onPress={() => {
                                        setCategoriasLimites(prev => {
                                            const newSet = new Set(prev);
                                            newSet.delete(item);
                                            return newSet;
                                        });
                                        setFields(prev => {
                                            const newLimites = { ...(prev.limites_categoria || {}) };
                                            delete newLimites[item];
                                            return {
                                                ...prev,
                                                limites_categoria: newLimites,
                                            };
                                        });
                                    }}>
                                        <MaterialIcons name="remove" size={24} color={isDarkMode ? '#BBB' : "#333"} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    })
                )
                }
                <TouchableOpacity onPress={() => setVisible(prev => !prev)} style={styles.newCategory}>
                    <Text style={[{ fontWeight: 'bold', color: '#DDD' }]}>Adicionar categorias</Text>
                    <MaterialIcons name="add" size={24} color={isDarkMode ? '#AAA' : "#333"} />
                </TouchableOpacity>
                <Modal visible={visible} transparent animationType="slide">
                    <View style={styles.overlay}>
                        <View style={[styles.modal, { backgroundColor: isDarkMode ? '#333' : '#EEE' }]}>
                            <FlatList
                                data={categorias}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setCategoriasLimites(prev => {
                                                const novoSet = new Set(prev);
                                                novoSet.has(item.label) ? novoSet.delete(item.label) : novoSet.add(item.label)
                                                return novoSet;
                                            });


                                        }}
                                    >
                                        <View style={categoriasLimites.has(item.label) ? styles.selected :
                                            { flex: 1, flexDirection: 'row', alignItems: 'center' }
                                        }>
                                            <View style={{ backgroundColor: `${item.color}`, borderRadius: 30, padding: 8 }}>
                                                <MaterialIcons name={item.icon} size={24} color={"#222"} />
                                            </View>
                                            <Text style={[styles.optionText, { color: isDarkMode ? '#DDD' : "#333" }]}>{item.label}</Text>
                                        </View>
                                    </TouchableOpacity>

                                )}
                            />
                            <ActionButtons
                                onCancel={() => setVisible(false)}
                                onCreate={() => { setVisible(false); setConfirmAction(true); }}
                                cancelLabel="Voltar"
                                createLabel="Confirmar"
                                cancelColor="#8d8d8d"
                            />
                        </View>

                    </View>
                </Modal>
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text style={[styles.title, { color: isDarkMode ? '#DDD' : "#333" }]}>Descrição do orçamento (opcional)</Text>
                <TextInput
                    keyboardType="decimal-pad"
                    placeholder={"Ex: Orçamento de férias"}
                    style={{ color: isDarkMode ? '#DDD' : "#333" }}
                    value={fields.desc_budget}
                    onChangeText={(text) => setFields({ ...fields, desc_budget: text })}
                    placeholderTextColor={isDarkMode ? '#b9b6b6' : "#333"}
                />
            </View>
            <View style={styles.separator} />
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => console.log('Criar action')}
                cancelLabel="Cancelar"
                createLabel="Criar"
                cancelColor="#8d8d8d"
            />
        </View>
    )
}

export default CreateBudget

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        gap: 10,
    },
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    section: {
        width: 250,
        marginBottom: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selected: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#6b6b6b',
        padding: 5,
        borderRadius: 20,
    },
    newCategory: {
        width: 250,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#666',
        padding: 5,
        paddingHorizontal: 20,
        marginBottom: 5,
        borderRadius: 10,
        elevation: 5,
    },
    input: {

    },
    buttonSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignSelf: 'flex-end',
        width: 200,
        marginTop: 25,
    },
    button: {
        backgroundColor: '#0099cc',
        alignSelf: 'flex-start',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 4,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    modal: {
        borderRadius: 10,
        padding: 20,
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
    separator: {
        height: 2,
        marginHorizontal: -30,
        backgroundColor: '#111',
        alignSelf: 'stretch',
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