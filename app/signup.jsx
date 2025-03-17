import { StyleSheet, Text, View, SafeAreaView, TextInput, Pressable } from 'react-native'
import { Link } from 'expo-router';
import Fontisto from '@expo/vector-icons/Fontisto';
import { Inter_300Light, useFonts } from '@expo-google-fonts/inter'

import React from 'react'


const mainScreen = () => {

    const [fontsLoaded] = useFonts({
        Inter_300Light,
    });
    if (!fontsLoaded) {
        return null;
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.view}>
                <Text style={styles.title}>Cadastre-se</Text>

                <View style={styles.viewContainer}>
                    <Fontisto name="email" size={24} color="black" />
                    <Text style={styles.text}>Nome</Text>
                </View>

                <TextInput style={styles.input} placeholder='Insira Seu Nome' />

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

                <View style={styles.viewContainer}>
                    <Fontisto name="locked" size={24} color="black" />
                    <Text style={styles.text}>Senha</Text>
                </View>

                <TextInput style={styles.input} placeholder='Insira Sua Senha Novamente' />

                <Pressable style={styles.button} onPress={''}>
                    <Text style={styles.buttonText}>Cadastrar</Text>
                </Pressable>

                <Link href="/login" style={{ alignSelf: "center" }}>
                    <Text style={{ textDecorationLine: 'underline' }}>
                        Fazer Login
                    </Text>
                </Link>
            </View>
        </SafeAreaView>
    )
}

export default mainScreen

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
        borderColor: "black"

    },
    buttonText: {
        color: 'white',
        fontSize: 24,

    }
})