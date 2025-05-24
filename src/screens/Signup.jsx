import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native'
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native'
import { useAuth } from '@context/authContext';
import { useToast } from 'react-native-toast-notifications';

const SignupScreen = () => {
    const toast = useToast();
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({ nome: '', email: '', senha: '', confirmarSenha: '' });
    const [message, setMessage] = useState('');
    const { signUpMutation } = useAuth()

    const handleSignUp = async () => {
        if (!credentials.nome || !credentials.email || !credentials.senha || !credentials.confirmarSenha) {
            setMessage('Preencha todos os campos.');
            showError(message)
            return;
        }

        if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            setMessage('Formato de e-mail inválido.');
            showError(message)
            return;
        }

        if (credentials.senha != credentials.confirmarSenha) {
            setMessage('Senhas não coincidem.');
            showError(message)
            return;
        }
        signUpMutation.mutate(credentials, {
            onSuccess: () => {
                showNotif();
            },
            onError: () => {
                setMessage('Falha no login. Verifique suas credenciais.')
                showError(message);
            },
        });
    };

    const showNotif = () => {
        toast.show('Usuário cadastrado com sucesso', {
            type: 'success',
            duration: 1500,
        });
        setTimeout(() => {
            navigation.navigate('login');
        }, 500);
    }

    const showError = (text) => {
        toast.show(text, {
            type: 'error',
            duration: 1500,
        });
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.view}>

                <Text style={styles.title}>Cadastre-se</Text>
                <View style={styles.viewContainer}>
                    <Fontisto name="person" size={24} color="black" />
                    <Text style={styles.text}>Nome</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Seu Nome'
                    value={credentials.nome}
                    onChangeText={(text) => setCredentials({ ...credentials, nome: text })}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="email" size={24} color="black" />
                    <Text style={styles.text}>E-mail</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Seu Email'
                    value={credentials.email}
                    onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Sua Senha'
                    value={credentials.senha}
                    secureTextEntry={true}
                    onChangeText={(text) => setCredentials({ ...credentials, senha: text })}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Repita sua senha</Text>
                </View>

                <TextInput
                    style={styles.input}
                    placeholder='Insira Sua Senha Novamente'
                    value={credentials.confirmarSenha}
                    secureTextEntry={true}
                    onChangeText={(text) => setCredentials({ ...credentials, confirmarSenha: text })}
                />

                <Pressable style={styles.button} onPress={handleSignUp}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </Pressable>
                {/* <Text style={styles.message}>{message}</Text> */}
                <Pressable style={{ alignSelf: "center" }} onPress={() => {
                    navigation.navigate('login');
                }}>
                    <Text style={{ textDecorationLine: 'underline' }}>Fazer Login</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default SignupScreen

const styles = StyleSheet.create({
    safeArea: {
        backgroundColor: "#e0ebf3",
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center"
    },
    view: {
        gap: 10,
        flexDirection: "column",
        width: "75%",
        maxWidth: 500,
    },
    title: {
        alignSelf: "center",
        fontWeight: "600",
        fontSize: 36,
        marginBottom: 15,
    },
    text: {
        fontFamily: 'Inter_300Light',
        fontSize: 18,
    },
    viewContainer: {
        gap: 10,
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "flex-end"
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
        marginTop: 20,
        backgroundColor: '#3a9e58',
        borderWidth: 1,
        borderRadius: 10,
        borderColor: "black"

    },
    buttonText: {
        color: 'white',
        fontSize: 24,

    }
})