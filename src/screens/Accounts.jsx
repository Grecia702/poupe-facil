import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { API_URL } from '@env'
import Cookies from 'js-cookie'; // Mantenha js-cookie para armazenar o JWT no cookie

const BankAccount = ({ limit }) => {
    const [dados, setDados] = useState([])

    const checkDados = async () => {
        if (Platform.OS === 'web') {
            const token = Cookies.get('jwtToken');

            if (!token) {
                console.log("Token não encontrado.");
                return;
            }
        } else if (Platform.OS === 'android') {

            const token = await SecureStore.getItemAsync('jwtToken');
            if (!token) {
                console.log("Token mobile não encontrado.");
                return;
            }
        }
        try {
            const response = await axios.get(`${API_URL}/profile/account/list`, {
                withCredentials: true
            });

            console.log("Dados recebidos:", response.data);
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

    return (
        <FlatList
            contentContainerStyle={styles.list}
            data={dados.slice(0, limit)}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <View style={styles.container}>
                    <Ionicons style={styles.icon} name="cart" size={24} color="white" />
                    <MaterialCommunityIcons name="dots-horizontal" style={styles.menu} size={24} color="white" />
                    <MaterialCommunityIcons name="square-edit-outline" style={styles.edit} size={24} color="white" />
                    <View style={styles.info}>
                        <Text style={styles.nome_conta}>{item.nome_conta}</Text>
                        <Text style={styles.saldo}>R${item.saldo}</Text>
                    </View>
                </View>
            )}
        />
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        minHeight: 60,
        height: 'auto',
        width: 'auto',
        backgroundColor: 'rgb(0, 0, 0)',
        borderBottomColor: "rgb(185, 185, 185)",
        borderBottomWidth: 1,
        paddingHorizontal: 15,
        alignItems: "center",
        position: 'relative',
    },
    icon: {
        alignSelf: "center",
        backgroundColor: "rgb(39, 39, 39)",
        padding: 10,
        borderWidth: 1,
        borderRadius: 30,
    },
    info: {
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
        alignItems: "center",
        marginLeft: 10,
    },
    nome_conta: {
        color: 'rgb(214, 214, 214)',
        fontSize: 20,
        fontWeight: "700"
    },
    saldo: {
        textAlign: "left",
        width: 110,
        color: 'rgb(214, 214, 214)',
        fontSize: 16,
        fontWeight: '600',
        textDecorationLine: 'underline'
    },
    menu: {
        position: 'absolute',
        top: 0,
        right: "2%",
    },
    edit: {
        position: 'absolute',
        top: "45%",
        right: "2%",
    }
});

export default BankAccount;
