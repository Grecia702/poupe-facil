import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native'

const Logout = () => {
    const navigation = useNavigation();
    const { logoutMutation } = useAuth()

    const handleLogout = async () => {
        logoutMutation.mutate(null, {
            onSuccess: () => {
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                });
            },
            onError: () => {
                setMessage('Falha no logout, tente novamente');
            },
        });
    }
    return (
        <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Text>Fazer Logout</Text>
            <TouchableOpacity style={styles.button} onPress={() => handleLogout()}>
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