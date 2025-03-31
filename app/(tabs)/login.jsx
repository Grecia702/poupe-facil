import { Platform, StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState, useContext } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import Feather from '@expo/vector-icons/Feather';
import { AuthContext } from '../../context/authContext';
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(true);
    const { isLoggedIn, login, logout } = useContext(AuthContext);

    const toggleShowPassword = () => {
        setVisible(!visible);
    };

    // Requisição POST para login
    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email: email,
                senha: password
            });

            if (response.status === 200 && response.data.token) {

                const token = response.data.token;

                if (Platform.OS === 'web') {
                    Cookies.set('jwtToken', token, { expires: 7, path: '' });
                    console.log('Token armazenado no cookie (Web)');
                    setMessage('Login bem-sucedido');
                    login();
                } else {
                    await SecureStore.setItemAsync('jwtToken', token);
                    setMessage('Login bem-sucedido!');
                }
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Erro na requisição, tente novamente.');
            }
        }
        console.log("teste")
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
                    placeholder="Insira Seu Email"
                    value={email}
                    onChangeText={setEmail}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Insira Sua Senha"
                        value={password}
                        secureTextEntry={visible}
                        onChangeText={setPassword}
                    />

                    <Feather
                        onPress={toggleShowPassword}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: [{ translateY: -10 }]
                        }}
                        name={visible ? "eye" : "eye-off"}
                        size={24}
                        color="black"
                    />
                </View>

                <Link href="/" style={{ textDecorationLine: 'underline' }}>
                    Esqueci a minha senha
                </Link>

                <Pressable style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>

                <Text style={styles.message}>{message}</Text>

                <Link href="/signup" style={{ alignSelf: 'center', textDecorationLine: 'underline' }}>
                    Não tem uma conta? Cadastre-se
                </Link>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: '#e0ebf3',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    view: {
        gap: 10,
        width: '75%',
        maxWidth: 500,
    },
    title: {
        alignSelf: 'center',
        fontWeight: '600',
        fontSize: 36,
        margin: 20,
    },
    text: {
        fontSize: 18,
    },
    viewContainer: {
        gap: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 20,
        backgroundColor: 'white',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        marginTop: 32,
        backgroundColor: '#3a9e58',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: 'black',
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

export default LoginScreen;
