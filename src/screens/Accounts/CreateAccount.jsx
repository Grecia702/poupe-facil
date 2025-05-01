import { StyleSheet, SafeAreaView, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useState } from 'react'
import { ACCOUNT_ICONS } from '../../utils/accountIcons';
import { MaterialIcons } from '@expo/vector-icons'
import { useContasAuth } from '@context/contaContext';
import { useToast } from 'react-native-toast-notifications';

import { useNavigation } from '@react-navigation/native'

const CreateAccount = () => {
    const [selected, setSelected] = useState(ACCOUNT_ICONS[0]);
    const [visible, setVisible] = useState(false);
    const [message, setMessage] = useState(false)
    const navigation = useNavigation();
    const [fields, setFields] = useState({ saldo: '', nome_conta: '', tipo_conta: '', icone: `${selected.icon}`, desc_conta: '' });
    const { createAccountMutation } = useContasAuth()
    const toast = useToast();

    const handleCreate = async () => {

        if (fields.saldo === '' || fields.nome_conta === '' || fields.tipo_conta === '') {
            console.log("Campos obrigatórios em branco")
            setMessage(prev => !prev)
            return
        }

        createAccountMutation.mutate(fields, {
            onSuccess: () => showNotif(),
            onError: (error) => errorToast(error),
        });
    }

    const showNotif = () => {
        toast.show('Sucesso! Cadê meu dinheiro?', {
            type: 'success',
            duration: 1500,
        })
        setTimeout(() => {
            navigation.replace('Accounts');
        }, 500)

    }

    const errorToast = (message) => {
        toast.show(`${message}`, {
            type: 'error',
            duration: 1500,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.fields}>
                <Text>Nome *</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={"Minha Carteira"}
                    value={fields.nome_conta}
                    onChangeText={(text) => setFields({ ...fields, nome_conta: text })}
                />
            </View>
            <View style={styles.separator} />
            <View style={styles.fields}>
                <Text>Saldo Inicial *</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={"Ex: 1000,00"}
                    value={fields.saldo}
                    onChangeText={(text) => setFields({ ...fields, saldo: text })}
                />
            </View>
            <View style={styles.separator} />
            {/* <View style={styles.fields}>
                <Text>Data de criação</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={agora}
                    value={fields.data}
                    onChangeText={(text) => setFields({ ...fields, data: text })}
                />
            </View>
            <View style={styles.separator} /> */}
            <View style={styles.fields}>
                <Text>Tipo de conta</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={'Ex: Poupança, Emergência'}
                    value={fields.tipo_conta}
                    onChangeText={(text) => setFields({ ...fields, tipo_conta: text })}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>

                <Text>Ícone</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
                    <View style={styles.iconWrapper}>
                        <View style={{ backgroundColor: "#BBB", borderRadius: 30, padding: 8 }}>
                            <MaterialIcons name={selected.icon} size={24} color={"#666"} />
                        </View>
                        <Text style={styles.selectorText}>{selected.label}</Text>
                    </View>
                    <View>
                        <MaterialIcons name="arrow-drop-down" size={24} color="#666" />
                    </View>
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                        <View style={styles.modal}>
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
                                        <Text style={styles.optionText}>{item.label}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </TouchableOpacity>
                </Modal>
            </View>
            <View style={styles.separator} />
            <View style={styles.fields}>
                <Text>Descrição (opcional)</Text>
                <TextInput
                    style={{ flex: 1 }}
                    placeholder={"Conta bancária principal"}
                    value={fields.desc_conta}
                    onChangeText={(text) => setFields({ ...fields, desc_conta: text })}
                />
            </View>
            <View style={styles.separator} />

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: message ? 'space-between' : 'flex-end' }}>
                {message &&
                    (<Text style={styles.errorMessage}>*Prencha os campos obrigatórios</Text>)
                }
                <TouchableOpacity style={styles.button} onPress={() => handleCreate()}>
                    <Text style={{ color: 'white', fontWeight: 500 }}>Criar</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default CreateAccount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#CCC',
        padding: 30,
        gap: 10,
    },
    fields: {
        flexDirection: 'row',
        gap: 10,
        paddingVertical: 5
    },
    separator: {
        height: 2,
        marginHorizontal: -30,
        backgroundColor: 'black'
    },
    button: {
        backgroundColor: '#b82c2c',
        padding: 10,
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
        borderRadius: 8,
    },
    iconWrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    selectorText: {
        marginLeft: 10
    },
    overlay: {
        flex: 1,
        backgroundColor: '#00000066',
        justifyContent: 'center',
        padding: 20,
    },
    errorMessage: {
        fontWeight: 500,
        color: '#e92424',
    }
})