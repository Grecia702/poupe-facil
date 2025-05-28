import { View } from 'react-native'
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native'
import DangerModal from '@components/dangerModal';

const Logout = ({ isOpen, setIsOpen }) => {
    const navigation = useNavigation();
    const { logoutMutation } = useAuth()
    const handleLogout = async () => {
        setIsOpen(false)
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
            <DangerModal
                open={isOpen}
                setOpen={setIsOpen}
                onPress={() => handleLogout()}
                confirmButton={'Logout'}
                icon={'logout'}
                title={'Fazer Logout'}
                text={'Deseja sair de sua conta?\n Você terá que fazer login novamente.'}
            />
        </View>
    )
}

export default Logout
