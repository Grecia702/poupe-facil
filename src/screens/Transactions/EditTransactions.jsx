import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { format } from 'date-fns';
import api from '@context/axiosInstance'

const EditTransactions = () => {
    const [dadosAPI, setDadosAPI] = useState(null)
    const [dataMês, setDataMês] = useState(null)
    const route = useRoute();
    const { transactionId } = route.params;

    const buscarTransacao = async (id) => {
        try {
            const { data } = await api.get(`/profile/transaction/${id}`);
            console.log(data)
            setDadosAPI(data)
            setDataMês(format(data?.data_transacao, 'dd/MM/yyyy'));
        } catch (err) {
            console.err('Erro ao buscar transação por ID:', err);
        }
    };

    useEffect(() => {
        buscarTransacao(transactionId)
    }, [transactionId]);

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Valor</Text>
                <TextInput placeholder={`${dadosAPI?.valor}`} />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Categorias</Text>
                <TextInput
                    placeholder={`${dadosAPI?.categoria}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Data</Text>
                <TextInput
                    placeholder={`${dataMês}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Conta</Text>
                <TextInput
                    placeholder={`${dadosAPI?.id_contabancaria}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Tipo</Text>
                <TextInput
                    placeholder={`${dadosAPI?.tipo}`}
                />
            </View>
            <View style={styles.separator} />
            <TouchableOpacity style={styles.button}>
                <Text style={{ color: 'white', fontWeight: 500 }}>Salvar</Text>
            </TouchableOpacity>
        </View>
    )
}

export default EditTransactions

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
    }
})