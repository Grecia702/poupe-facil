import { Platform, StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/authContext';
import * as SecureStore from 'expo-secure-store';
import Cookies from 'js-cookie';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(false);
    const navigation = useNavigation();

    const { isLoggedIn, login, logout } = useContext(AuthContext);

    const toggleShowPassword = () => {
        setVisible(!visible);
    };

    // Requisição POST

    const handleLogin = async () => {
        try {
            const response = await axios.post('http://localhost:3000/api/users/login', {
                email: email,
                senha: password
            });

            if (response.status === 200 && response.data.token) {
                if (Platform.OS === 'web') {
                    Cookies.set('jwtToken', response.data.token, { expires: 7, path: '' });
                    console.log('Token armazenado no cookie (Web)');
                    setMessage('Login bem-sucedido')
                } else {
                    await SecureStore.setItemAsync('jwtToken', response.data.token);
                    console.log('Token armazenado de forma segura (Expo)');
                }
                setMessage('Login bem-sucedido!');

                login();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'index' }],
                });
            }
        } catch (error) {
            if (error.response) {
                setMessage(error.response.data.message);
            } else {
                setMessage('Erro na requisição, tente novamente.');
            }
        }
    };

    useEffect(() => {
        const checkLogin = async () => {
            let token;
            if (Platform.OS === 'web') {
                token = Cookies.get('jwtToken');
            } else {
                token = await SecureStore.getItemAsync('jwtToken');
            }
            if (token) {
                login();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'index' }],
                });
                console.log("cookie registrado")
            };
            checkLogin();
        }
    }, []);



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
                    <Ionicons
                        onPress={toggleShowPassword}
                        style={{
                            position: 'absolute',
                            right: 10,
                            top: '50%',
                            transform: [{ translateY: -10 }]
                        }}
                        name="eye-outline"
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
        fontFamily: 'Inter_300Light',
        fontSize: 18,
    },
    viewContainer: {
        gap: 10,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    input: {
        borderWidth: 1,
        borderRadius: 35,
        padding: 20,
        backgroundColor: 'white',
        fontFamily: 'Inter_300Light',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        marginTop: 32,
        backgroundColor: '#3a9e58',
        borderWidth: 1,
        borderRadius: 30,
        borderColor: 'black',
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

export default LoginScreen;
