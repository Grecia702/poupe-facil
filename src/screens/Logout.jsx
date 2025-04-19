import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect } from 'react'
import { AuthContext, useAuth } from '../../context/authContext';
import { useNavigation } from '@react-navigation/native'
import * as SecureStore from 'expo-secure-store';



const Logout = () => {
    const navigation = useNavigation();
    const { logout } = useContext(AuthContext);

    const logOut = async () => {
        try {
            await logout();
            navigation.replace('login')
            console.log("Deslogado com sucesso")
        } catch (err) {
            console.log("Não foi possivel deslogar por conta do erro: ", err.response.data.message)
        }
    }

    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Fazer Logout</Text>
            <TouchableOpacity style={styles.button} onPress={() => logOut()}>
                <Text style={styles.Texto}>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}

export default Logout

const styles = StyleSheet.create({
    button: {
        width: 'auto',
        height: 50,
        backgroundColor: 'blue',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Texto: {
        color: 'white',
        fontSize: 16
    }
})