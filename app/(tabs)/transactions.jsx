import { StyleSheet, Text, View, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import Cookies from 'js-cookie';
import moment from 'moment'

const Transactions = ({ limit }) => {
    const [dados, setDados] = useState([])

    const checkDados = async () => {
        const token = Cookies.get('jwtToken');

        if (!token) {
            console.log("Token não encontrado.");
            return;
        }
        try {
            const response = await axios.get("http://localhost:3000/api/users/profile/transaction/list", {
                withCredentials: true
            });

            if (response.status === 200) {
                setDados(response.data);
            }
        }
        catch (error) {
            console.log("Erro ao fazer requisição:", error);
        }
    }
    useEffect(() => {
        checkDados();
    }, []);

    const renderItem = ({ item }) => {

        const formattedDate = moment(item.data_compra).format('YYYY/MM/DD')
        if (item.tipo === "Despesa") {
            return (
                <View style={styles.widget}>
                    <Ionicons style={styles.icon} name="cart" size={24} color="black" />
                    <View style={styles.info}>
                        <Text style={styles.conta}>{item.conta}</Text>
                        <Text style={styles.categoria}>{item.categoria}</Text>
                        <Text style={styles.valor}>-R${item.valor}</Text>
                        <Text style={styles.data}>{formattedDate}</Text>
                    </View>
                </View>
            );
        } else {

            return (
                <View style={styles.widget}>
                    <Ionicons style={styles.icon} name="cart" size={24} color="black" />
                    <View style={styles.info}>
                        <Text style={styles.conta}>{item.conta}</Text>
                        <Text style={styles.categoria}>{item.categoria}</Text>
                        <Text style={styles.valor}>R${item.valor}</Text>
                        <Text style={styles.data}>{formattedDate}</Text>
                    </View>
                </View>
            );
        }
    };
    return (
        <FlatList
            contentContainerStyle={styles.list}
            data={dados.slice(0, limit)}
            keyExtractor={(item) => item.transaction_id}
            renderItem={renderItem}

        />
    );
}

export default Transactions

const styles = StyleSheet.create({
    widget: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        maxHeight: 80,
        maxWidth: '100%',
        backgroundColor: "rgb(31, 31, 31)",
        borderColor: "white",
        borderWidth: 1,
        padding: 15,
        shadowColor: 'rgb(59, 59, 59)',
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
    },
    info: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
        position: 'relative',
    },
    icon: {
        alignSelf: 'flex-start',
        backgroundColor: 'rgb(214, 214, 214)',
        width: 'auto',
        padding: 10,
        borderWidth: 1,
        borderRadius: 24,
    },
    conta: {
        position: 'absolute',
        top: "0%",
        fontSize: 16,
        color: 'white'
    },
    categoria: {
        position: 'absolute',
        top: "80%",
        lineHeight: 0,
        fontSize: 16,
        color: 'white'
    },
    valor: {
        lineHeight: 0,
        position: 'absolute',
        top: "80%",
        left: '70%',
        fontSize: 16,
        fontWeight: 600,
        textShadowColor: 'black', // Cor do contorno
        textShadowOffset: { width: 1, height: 1 }, // Ajuste da posição do contorno
        textShadowRadius: 1,
        color: 'rgb(245, 245, 245)',
    },
    data: {
        position: 'absolute',
        top: "0%",
        left: '70%',
        fontSize: 16,
        color: 'white'
    },

});