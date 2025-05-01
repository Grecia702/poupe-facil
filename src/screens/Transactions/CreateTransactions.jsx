import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, FlatList } from 'react-native'
import React, { useState } from 'react'
import { CATEGORIAS } from '../../utils/categorias';
import { MaterialIcons } from '@expo/vector-icons'

const CreateTransactions = () => {
    const [selected, setSelected] = useState(CATEGORIAS[0]);
    const [visible, setVisible] = useState(false);
    const agora = new Date().toLocaleDateString('pt-BR').slice(0, 10)
    const [fields, setFields] = useState({ valor: '0,00', categoria: '', data: `${agora}`, conta: '', tipo: '' });

    const categoriaIcons = {
        Contas: 'credit-card',
        Alimentação: 'restaurant-menu',
        Carro: 'directions-car',
        Internet: 'computer',
        Lazer: 'beach-access',
        Educação: 'menu-book',
        Compras: 'shopping-cart',
        Outros: 'more-horiz',
    };


    // console.log(fields)

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Valor</Text>
                <TextInput
                    placeholder={"R$0,00"}
                    value={fields.valor}
                    onChangeText={(text) => setFields({ ...fields, valor: text })}
                    required
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'column', gap: 10, paddingVertical: 5 }}>
                <Text>Categorias</Text>
                <TouchableOpacity style={styles.selector} onPress={() => setVisible(true)}>
                    <MaterialIcons name={selected.icon} size={20} />
                    <Text style={styles.selectorText}>{selected.label}</Text>
                </TouchableOpacity>

                <Modal visible={visible} transparent animationType="slide">
                    <TouchableOpacity style={styles.overlay} onPress={() => setVisible(false)}>
                        <View style={styles.modal}>
                            <FlatList
                                data={CATEGORIAS}
                                keyExtractor={(item) => item.label}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={styles.option}
                                        onPress={() => {
                                            setSelected(item);
                                            setFields({ ...fields, categoria: selected.label });
                                            setVisible(false);
                                        }}
                                    >
                                        <View style={{ backgroundColor: `${item.color}`, borderRadius: 30, padding: 8 }}>
                                            <MaterialIcons name={item.icon} size={24} color={"#DDD"} />
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
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Data</Text>
                <TextInput
                    placeholder={agora}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Conta</Text>
                <TextInput
                    placeholder={"Conta Bancaria"}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Tipo</Text>
                <TextInput
                    placeholder={"Tipo"}
                />
            </View>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.button}>
                <Text style={{ color: 'white', fontWeight: 500 }}>Criar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default CreateTransactions

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
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#999',
        padding: 10,
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