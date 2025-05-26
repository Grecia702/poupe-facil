import { StyleSheet, SafeAreaView, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import { ACCOUNT_ICONS } from '../../utils/accountIcons';
import { MaterialIcons } from '@expo/vector-icons'
import { useContasAuth } from '@context/contaContext';
import { useToast } from 'react-native-toast-notifications';
import ActionButtons from '@components/actionButtons';
import CustomInput from '@components/customInput';
import CustomModal from '@components/customModal';
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'

import { useNavigation } from '@react-navigation/native'

const CreateAccount = () => {
    const [selected, setSelected] = useState(ACCOUNT_ICONS[0]);
    const { isDarkMode } = useContext(colorContext);
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();
    const [formatado, setFormatado] = useState('R$ 0,00');
    const [fields, setFields] = useState({ saldo: '', nome_conta: '', icone: `${selected.icon}`, tipo_conta: `${selected.icon}`, desc_conta: '' });
    const { createAccountMutation, refetch } = useContasAuth()
    const toast = useToast();

    const handleCreate = async () => {
        if (fields.saldo === '' || fields.nome_conta === '') {
            errorToast("Campos obrigatórios em branco")
            return
        }
        createAccountMutation.mutate(fields, {
            onSuccess: () => refetch().then(() => toastSuccess()),
            onError: (error) => errorToast(error),
        });
    }

    const toastSuccess = () => {
        toast.show(`Conta ${fields.nome_conta} criada com sucesso`, {
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
                description={'Nome da conta*'}
                type={'default'}
                value={fields.nome_conta}
                placeholder={"Ex: Conta Banco A"}
                onChangeText={(text) => setFields({ ...fields, nome_conta: text })}
                required
            />
            <CustomInput
                description={'Saldo inicial*'}
                type={'numeric-pad'}
                placeholder={"Ex: 1000,00"}
                value={formatado}
                onChangeText={(text) => handleChange('saldo', text)}
                required
            />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : '#333' }]}>Tipo</Text>
                <View style={[styles.buttonInput, { backgroundColor: isDarkMode ? '#222' : '#fff', borderColor: isDarkMode ? '#333' : '#ccc' }]}>
                    <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
                        <View style={styles.iconWrapper}>
                            <View style={{ backgroundColor: "#BBB", borderRadius: 30, padding: 8 }}>
                                <MaterialIcons name={selected.icon} size={24} color={"#666"} />
                            </View>
                            <Text style={[styles.selectorText, { color: isDarkMode ? '#ccc' : '#333' }]}>
                                {selected.label}
                            </Text>
                        </View>
                        <View>
                            <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                        </View>
                    </TouchableOpacity>
                </View>
                <CustomModal visible={visible} setVisible={setVisible}>
                    <FlatList
                        data={ACCOUNT_ICONS}
                        keyExtractor={(item) => item.label}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.option}
                                onPress={() => {
                                    setSelected(item);
                                    setFields({ ...fields, icone: item.icon });
                                    setVisible(false);
                                }}
                            >
                                <View style={{ backgroundColor: "#DDD", borderRadius: 30, padding: 8 }}>
                                    <MaterialIcons name={item.icon} size={24} color={"#666"} />
                                </View>
                                <Text style={[styles.optionText, { color: isDarkMode ? '#ccc' : '#333' }]}>{item.label}</Text>
                            </TouchableOpacity>
                        )}
                    />
                </CustomModal>
            </View>
            <CustomInput
                description={'Descrição (opcional)'}
                type={'default'}
                placeholder={'Insira uma descrição...'}
                value={fields.desc_conta}
                onChangeText={(text) => setFields({ ...fields, desc_conta: text })}
                height={100}
            />
            <ActionButtons
                onCancel={() => navigation.goBack()}
                onCreate={() => handleCreate()}
                cancelLabel="Voltar"
                createLabel="Criar"
                cancelColor="#8d8d8d"
            />
        </View>
    )
}

export default CreateAccount


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