import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { TransactionContext } from '@context/transactionsContext';
import { format, isValid, parseISO } from 'date-fns';

const EditTransactions = () => {
    const [dados, setDados] = useState(null)
    const [data, setData] = useState('')
    const { fetchData } = useContext(TransactionContext);
    const route = useRoute();
    const { transactionId } = route.params;

    useEffect(() => {
        const fetchAndSet = async () => {
            const data = await fetchData(transactionId);
            setDados(data);
        };
        fetchAndSet();
    }, [transactionId]);

    useEffect(() => {
        if (dados) {
            setData(format(dados?.data_transacao, 'dd/MM/yyyy'));
        }
    }, [dados]);

    // const data = new Date('2024-11-19T12:47:26.000Z');
    // if (isValid(data)) {
    //   console.log("Data válida:", data);
    // } else {
    //   console.log("Data inválida!");
    // }


    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Valor</Text>
                <TextInput placeholder={`${dados?.valor}`} />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Categorias</Text>
                <TextInput
                    placeholder={`${dados?.categoria}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Data</Text>
                <TextInput
                    placeholder={`${data}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Conta</Text>
                <TextInput
                    placeholder={`${dados?.id_contabancaria}`}
                />
            </View>
            <View style={styles.separator} />
            <View style={{ flexDirection: 'row', gap: 10, paddingVertical: 5 }}>
                <Text>Tipo</Text>
                <TextInput
                    placeholder={`${dados?.tipo}`}
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