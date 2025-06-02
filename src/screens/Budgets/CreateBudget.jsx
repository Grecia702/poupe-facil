import { StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList } from 'react-native'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'
import { useToast } from 'react-native-toast-notifications';
import { useNavigation } from '@react-navigation/native';
import ActionButtons from '@components/actionButtons';
import categorias from '@utils/categorias.json';
import { formatISO, startOfMonth, endOfMonth } from 'date-fns';
import CustomInput from '@components/customInput';
import CustomModal from '@components/customModal';
import { useBudgetAuth } from '@context/budgetsContext'

const CreateBudget = () => {
    const navigation = useNavigation();
    const { isDarkMode } = useContext(colorContext);
    const [visible, setVisible] = useState(false);
    const { refetchBudget, createBudgetMutation } = useBudgetAuth();
    const toast = useToast();
    const [fields, setFields] = useState({
        quantia_limite: '',
        quantia_limiteFormatted: '',
        data_inicio: formatISO(startOfMonth(new Date())),
        data_termino: formatISO(endOfMonth(new Date())),
        limites_categorias: {},
    });
    const [categoriasLimites, setCategoriasLimites] = useState(new Set());
    const handleCurrencyInput = (text, campo) => {
        const numeric = text.replace(/\D/g, '');
        const number = (Number(numeric) / 100).toFixed(2);

        if (campo) {
            setFields(prev => ({
                ...prev,
                limites_categorias: {
                    ...(prev.limites_categorias || {}),
                    [campo]: parseFloat(number),
                },
            }));
        } else {
            setFields(prev => ({
                ...prev,
                quantia_limite: parseFloat(number),
            }));
        }
    };

    const handleBudget = async () => {
        if (!fields.quantia_limite) {
            toastError('Preencha os campos obrigatórios');
            return;
        }

        createBudgetMutation.mutate(fields, {
            onSuccess: () => refetchBudget().then(() => toastSuccess()),
            onError: (error) => toastError(error),
        });
    };

    const toastSuccess = () => {
        toast.show('Orçamento criado com sucesso', {
            type: 'success',
            duration: 2500,
        });
        setTimeout(() => {
            navigation.goBack();
        }, 50);
    }

    const toastError = (text) => {
        toast.show(`${text}`, {
            type: 'error',
            duration: 1500,
        });
    }

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? "#333" : '#ffffff' }]}>
            {/* <CustomInput
                description={'Período (mês e ano)*'}
                type={'default'}
                value={fields.data_desc}
                onChangeText={(text) => handleCurrencyInput(text)}
                placeholder={'Maio de 2025'}
                required
            /> */}
            <CustomInput
                description={'Valor limite do orçamento*'}
                type={'numeric-pad'}
                value={(fields?.quantia_limite || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                onChangeText={(text) => handleCurrencyInput(text)}
                required
            />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text style={[styles.title, { marginTop: 8, marginBottom: 8, color: isDarkMode ? '#DDD' : "#333" }]}>Limites de categorias (opcional)</Text>
                {(categoriasLimites.size > 0 && !visible) && (
                    [...categoriasLimites].map(item => {
                        return (
                            <View key={item} style={styles.section}>
                                <Text style={{ fontSize: 16, color: isDarkMode ? '#DDD' : "#333" }}>{item}</Text>
                                <View style={styles.labels}>
                                    <TextInput
                                        keyboardType="decimal-pad"
                                        placeholder={"R$0,00"}
                                        style={{ color: isDarkMode ? '#DDD' : "#333", flex: 1, }}
                                        maxLength={20}
                                        value={fields.limites_categorias[item]?.toLocaleString('pt-BR', {
                                            style: 'currency',
                                            currency: 'BRL',
                                        })}
                                        onChangeText={(text) => handleCurrencyInput(text, item)}
                                        placeholderTextColor={isDarkMode ? '#b9b6b6' : "#333"}
                                    />
                                    <TouchableOpacity
                                        onPress={() => {
                                            setCategoriasLimites(prev => {
                                                const newSet = new Set(prev);
                                                newSet.delete(item);
                                                return newSet;
                                            });
                                            setFields(prev => {
                                                const newLimites = { ...(prev.limites_categorias || {}) };
                                                delete newLimites[item];
                                                return {
                                                    ...prev,
                                                    limites_categorias: newLimites,
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
                    <MaterialIcons name="add" size={24} color={isDarkMode ? '#ddd' : "#132d83"} />
                    <Text style={[styles.title, { color: isDarkMode ? '#ddd' : "#132d83" }]}>Adicionar categorias</Text>
                </TouchableOpacity>
                <CustomModal visible={visible} setVisible={setVisible} handleAction={() => console.log('oi')}>
                    <FlatList
                        data={Object.values(categorias)}
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
                        onCancel={() => { categoriasLimites.clear(); setVisible(false) }}
                        onCreate={() => setVisible(false)}
                        createLabel={'Salvar'}
                    />
                </CustomModal>
            </View>
            <CustomInput
                description={'Descrição do orçamento (opcional)'}
                type={'default'}
                value={fields.desc_budget}
                placeholder={'Ex: limite para as férias do ano'}
                onChangeText={(text) => setFields({ ...fields, desc_budget: text })}
                height={100}
            />
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => handleBudget()}
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
        fontWeight: '500'
    },
    section: {
        marginBottom: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    labels: {
        flexDirection: 'row',
        width: 160,
        padding: 10,
        borderColor: '#cacaca',
        borderWidth: 1,
        borderRadius: 10,
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
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8
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