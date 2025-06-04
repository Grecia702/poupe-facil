import { StyleSheet, Text, View, ScrollView, Pressable, Image } from 'react-native'
import React from 'react'
const NoData = require('@assets/no_data.png')
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useProfile } from '@hooks/useProfile'
import UserIcon from '@assets/user-icon.svg'
import UploadImageScreen from '@screens/New';
import { useNavigation } from '@react-navigation/native';

const Profile = () => {
    const navigation = useNavigation()
    const { data } = useProfile()
    console.log(data)

    return (
        <View style={styles.container}>

            <View style={{ alignItems: 'center', paddingTop: 40, padding: 20 }}>
                <View style={{ borderWidth: 2, borderRadius: 400, alignItems: 'center', marginBottom: 24, overflow: 'hidden' }}>

                    <View>
                        <UserIcon width={96} height={96} />
                    </View>
                </View>
                <Text style={styles.name}>
                    {data?.nome}
                </Text>
                <View style={styles.email}>
                    <Text style={styles.emailText}>
                        {data?.email}
                    </Text>
                </View>
            </View>

            <View style={styles.widget}>
                <Pressable style={({ pressed }) => [
                    styles.field,
                    {
                        opacity: pressed ? 0.4 : 1,
                        transform: [{ scale: pressed ? 1.01 : 1 }],
                        backgroundColor: pressed ? '#aaa' : '#eee'
                    }
                ]}>
                    <Text style={styles.fieldsTitle}>
                        Editar Perfil
                    </Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </Pressable>

                <Pressable style={({ pressed }) => [
                    styles.field,
                    {
                        opacity: pressed ? 0.6 : 1,
                        transform: [{ scale: pressed ? 1.01 : 1 }],
                        backgroundColor: pressed ? '#aaa' : '#eee'
                    }
                ]}>
                    <Text style={styles.fieldsTitle}>
                        Notificações
                    </Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </Pressable>
                <Pressable style={({ pressed }) => [
                    styles.field,
                    {
                        opacity: pressed ? 0.3 : 1,
                        transform: [{ scale: pressed ? 1.01 : 1 }],
                        backgroundColor: pressed ? '#aaa' : '#eee'
                    }
                ]}>
                    <Text style={styles.fieldsTitle}>
                        Segurança
                    </Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </Pressable>

                <Pressable style={({ pressed }) => [
                    styles.field,
                    {
                        opacity: pressed ? 0.6 : 1,
                        transform: [{ scale: pressed ? 1.01 : 1 }],
                        backgroundColor: pressed ? '#aaa' : '#eee'
                    }
                ]}>
                    <Text style={styles.fieldsTitle}>
                        Aparencia
                    </Text>
                    <MaterialIcons name="navigate-next" size={24} color="black" />
                </Pressable>

            </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#e9e9e9',
    },
    name: {
        fontSize: 24,
        fontWeight: 400,
        marginBottom: 8
    },
    email: {
        backgroundColor: '#6983d850',
        borderRadius: 10,
        padding: 10,
        paddingHorizontal: 30,
        marginTop: 12
    },
    emailText: {
        fontWeight: 600,
        color: '#155ee4'
    },
    widget: {
        backgroundColor: '#eeeeee',
        borderRadius: 10,
        elevation: 2,
        marginTop: 32,
    },
    field: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    fieldsTitle: {
        fontSize: 16,
    }
})