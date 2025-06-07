import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Pressable, Image } from 'react-native';
import Fontisto from '@expo/vector-icons/Fontisto';
import { useState } from 'react';
import Feather from '@expo/vector-icons/Feather';
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native'
import { useToast } from 'react-native-toast-notifications';
import { GoogleSignin, isSuccessResponse } from '@react-native-google-signin/google-signin';
const googleLogo = require('../../assets/images/google__g__logo.png');

GoogleSignin.configure({
    iosClientId: '159358840833-asm7tcmu7b119g66b833qj5kf8f2gngu.apps.googleusercontent.com',
    webClientId: '159358840833-0r4bov8kj1rrin0f3mu5c1trl99od9qt.apps.googleusercontent.com',
    offlineAccess: true,
})

const LoginScreen = () => {
    const toast = useToast();
    const navigation = useNavigation();
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');
    const [visible, setVisible] = useState(true);
    const { loginMutation, googleMutation } = useAuth()


    const handleGoogleSignIn = async () => {
        try {
            await GoogleSignin.hasPlayServices()
            const response = await GoogleSignin.signIn()

            if (isSuccessResponse(response)) {
                const { idToken } = response.data
                googleMutation.mutate({ idToken }, {
                    onSuccess: () => toastSuccess(),
                    onError: (error) => {
                        if (error.response && error.response.data) {
                            console.log('Erro da API:', error.response.data);
                            toastError(error.response.data.message || 'Erro ao fazer login.');
                        } else if (error.message) {
                            console.log('Erro:', error.message);
                            toastError(error.message);
                        } else {
                            console.log('Erro desconhecido:', error);
                            toastError('Erro desconhecido.');
                        }
                    },
                });
            }
        } catch (error) {
            console.log(error)
        }
    }



    const toggleShowPassword = () => {
        setVisible(!visible);
    };

    const handleLogin = async () => {
        if (!credentials.email || !credentials.password) {
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
                    autoCapitalize="none"
                    autoCorrect={false}
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
                        value={credentials.password}
                        autoCapitalize="none"
                        onChangeText={(text) => setCredentials({ ...credentials, password: text })}
                        secureTextEntry={visible}
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

                <TouchableOpacity style={[styles.button, { marginTop: 30 }]} onPress={handleLogin}>
                    <Text style={styles.buttonText}>Login</Text>
                </TouchableOpacity>
                <Text style={{ alignSelf: 'center' }}>Ou</Text>
                <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f3f3', padding: 15, borderColor: '#555555', gap: 15 }]} onPress={handleGoogleSignIn}>
                    <Image
                        style={{ width: 24, height: 24 }}
                        source={googleLogo}
                    />

                    <Text style={{ alignSelf: 'center', fontSize: 16, fontWeight: 400, color: '#3C4043' }}>Continue com o Google</Text>
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
        backgroundColor: '#e6eeeb',
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
        borderRadius: 5,
        padding: 20,
        backgroundColor: 'white',
        maxHeight: 60
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 64,
        backgroundColor: '#3a9e58',
        borderWidth: 1,
        borderRadius: 35,
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