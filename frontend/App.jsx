import { AuthProvider } from '@context/authContext';
import { ContasProvider } from '@context/contaContext';
import { TransactionProvider } from '@context/transactionsContext';
import { BudgetProvider } from '@context/budgetsContext';
import { GoalsProvider } from '@context/goalsContext';
import { ColorProvider } from '@context/colorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'react-native-toast-notifications';
import CustomToast from './customToast';
import Routes from './src/routes';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, PermissionsAndroid } from 'react-native';

const queryClient = new QueryClient();

// // Configuração padrão para notificação
// Notifications.setNotificationHandler({
//     handleNotification: async () => ({
//         shouldShowAlert: true,
//         shouldPlaySound: false,
//         shouldSetBadge: false,
//     }),
// });

// const getPushToken = async () => {
//     if (!Device.isDevice) {
//         console.log('As notificações só funcionam em dispositivos físicos.');
//         return;
//     }

//     // ANDROID 13+ → Solicita permissão POST_NOTIFICATIONS
//     if (Platform.OS === 'android' && Platform.Version >= 33) {
//         const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
//         );

//         if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
//             console.log('Permissão POST_NOTIFICATIONS negada.');
//             return;
//         }
//     }

//     const { status: existingStatus } = await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//     }

//     if (finalStatus !== 'granted') {
//         console.log('Permissão negada para notificações');
//         return;
//     }

//     const token = (await Notifications.getExpoPushTokenAsync()).data;
//     const existingToken = await AsyncStorage.getItem('expoPushToken');

//     if (!existingToken) {
//         await AsyncStorage.setItem('expoPushToken', token);
//         console.log('Novo token:', token);
//     } else {
//         console.log('Token já salvo:', existingToken);
//     }

//     return token;
// };

export default function App() {
    // useEffect(() => {
    //     console.log('App montado');
    //     getPushToken();
    // }, []);

    return (
        <ColorProvider>
            <ToastProvider
                renderToast={(toastOptions) => <CustomToast {...toastOptions} />}
                placement="top"
            >
                <QueryClientProvider client={queryClient}>
                    <AuthProvider>
                        <GoalsProvider>
                            <BudgetProvider>
                                <ContasProvider>
                                    <TransactionProvider>
                                        <Routes />
                                    </TransactionProvider>
                                </ContasProvider>
                            </BudgetProvider>
                        </GoalsProvider>
                    </AuthProvider>
                </QueryClientProvider>
            </ToastProvider>
        </ColorProvider>
    );
}
