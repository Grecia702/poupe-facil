import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable, Linking } from 'react-native'
import { Link } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Inter_300Light, useFonts } from '@expo-google-fonts/inter'

import React from 'react'


const LoginScreen = () => {

    const [fontsLoaded] = useFonts({
        Inter_300Light,
    });
    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.view}>
                <Text style={styles.title}>Login</Text>
                <View style={styles.viewContainer}>
                    <Fontisto name="email" size={24} color="black" />
                    <Text style={styles.text}>E-mail</Text>
                </View>

                <TextInput style={styles.input} placeholder='Insira Seu Email' />

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <TextInput style={styles.input} placeholder='Insira Sua Senha' />

                <Link href="/" style={{ textDecorationLine: 'underline' }}>
                    Esqueci a minha senha
                </Link>

                <Pressable style={styles.button} onPress={''}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>

                <Link href="/signup" style={{ alignSelf: "center", textDecorationLine: 'underline' }}>
                    Não tem uma conta? Cadastre-se
                </Link>
            </View>
        </SafeAreaView >
    )
}

export default LoginScreen

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
        width: "75%",
        maxWidth: 500,
    },
    title: {
        alignSelf: "center",
        fontWeight: "600",
        fontSize: 36,
        margin: 20
    },
    text: {
        fontFamily: 'Inter_300Light',
        fontSize: 18,
    },
    viewContainer: {
        gap: 10,
        flexDirection: "row",
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
})