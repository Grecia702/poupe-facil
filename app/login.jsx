import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Inter_300Light } from '@expo-google-fonts/inter';

import React, { useState } from 'react';
import axios from 'axios';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = () => {
        axios
            .post('http://127.0.0.1:3000/api/users/login', { email: email, senha: password })
            .then((response) => {
                if (response.status === 200) {
                    setMessage(response.data.message);
                }
            })
            .catch((error) => {

                if (error.response) {
                    setMessage(error.response.data.message);
                } else {
                    setMessage('Erro na requisição, tente novamente.');
                }
            });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.view}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.viewContainer}>
                    <Fontisto name="email" size={24} color="black" />
                    <Text style={styles.text}>E-mail</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Seu Email'
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Sua Senha'
                    value={password}
                    secureTextEntry={true}
                    onChangeText={setPassword}
                />
                <Link href="/" style={{ textDecorationLine: 'underline' }}>
                    Esqueci a minha senha
                </Link>

                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>

                {message && <Text style={styles.message}>{message}</Text>}

                <Link href="/signup" style={{ alignSelf: "center", textDecorationLine: 'underline' }}>
                    Não tem uma conta? Cadastre-se
                </Link>
            </View>
        </SafeAreaView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#e0ebf3",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    view: {
        gap: 10,
        width: "75%",
        maxWidth: 500,
    },
    title: {
        alignSelf: "center",
        fontWeight: "600",
        fontSize: 36,
        margin: 20,
    },
    text: {
        fontFamily: 'Inter_300Light',
        fontSize: 18,
    },
    viewContainer: {
        gap: 10,
        flexDirection: "row",
        alignItems: "flex-end",
    },
    input: {
        borderWidth: 1,
        borderRadius: 5,
        padding: 20,
        backgroundColor: "white",
        fontFamily: 'Inter_300Light',
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        height: 64,
        marginTop: 32,
        backgroundColor: '#3a9e58',
        borderWidth: 1,
        borderColor: "black",
        color: 'white',
        fontSize: 24,
        fontWeight: 700,
        fontFamily: 'Inter_300Light',
    },
    buttonText: {
        color: 'white',
        fontSize: 24,
    },
    message: {
        marginTop: 20,
        fontSize: 16,
        color: 'green',
        textAlign: 'center',
    },
});
