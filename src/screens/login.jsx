import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Pressable } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import React, { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';


const LoginScreen = () => {
    const toast = useToast();
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({ email: '', senha: '' });
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(true);
    const { loginMutation } = useAuth()

    const toggleShowPassword = () => {
        setVisible(!visible);
    };

    const handleLogin = async () => {
        if (!credentials.email || !credentials.senha) {
            toastError('Preencha todos os campos.');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(credentials.email)) {
            toastError('Formato de e-mail inválido.');
            return;
        }

        loginMutation.mutate(credentials, {
            onSuccess: () => toastSuccess(),
            onError: (error) => toastError(error),
        });
    };

    const toastSuccess = () => {
        toast.show('Seja bem-vindo novamente', {
            type: 'success',
            duration: 1500,
        });
        setTimeout(() => {
            navigation.replace('home');
        }, 50);
    }

    const toastError = (text) => {
        toast.show(`${text}`, {
            type: 'error',
            duration: 1500,
        });
    }



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
                    value={credentials.email}
                    keyboardType='email-address'
                    autoFocus={true}
                    onChangeText={(text) => setCredentials({ ...credentials, email: text })}
                />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                    <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="Insira Sua Senha"
                        value={credentials.senha}
                        autoCapitalize="none"
                        onChangeText={(text) => setCredentials({ ...credentials, senha: text })}
                        secureTextEntry={visible}
                        required
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

                {/* <Link href="/" style={{ textDecorationLine: 'underline' }}>
                    Esqueci a minha senha
                </Link> */}

                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>

                <Text style={[styles.message, { color: loginMutation.isError ? 'red' : 'green' }]}>
                    {message}
                </Text>

                <Pressable style={{ alignSelf: 'center', textDecorationLine: 'underline' }} onPress={() => navigation.navigate('signup')}>
                    <Text style={{ alignSelf: 'center', textDecorationLine: 'underline' }}>Não tem uma conta? Cadastre-se</Text>
                </Pressable>
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
        maxHeight: 60
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
