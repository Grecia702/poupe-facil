import { View } from 'react-native'
import { useAuth } from '@context/authContext';
import { useNavigation } from '@react-navigation/native'
import DangerModal from '@components/dangerModal';
import { useToast } from 'react-native-toast-notifications';

const Logout = ({ isOpen, setIsOpen }) => {
    const navigation = useNavigation();
    const toast = useToast();
    const { logoutMutation } = useAuth()
    const handleLogout = async () => {
        setIsOpen(false)
        logoutMutation.mutate(null, {
            onSuccess: () => {
                toastSuccess();
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'login' }],
                });
            },
            onError: (error) => {
                ToastError(`Erro ao fazer logout: ${error}`)
            },
        });
    }
    const toastSuccess = () => {
        toast.show('Logout feito com sucesso', {
            type: 'success',
            duration: 3000,
        })
    }
    const ToastError = (message) => {
        toast.show(`${message}`, {
            type: 'error',
            duration: 3000,
        })
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
