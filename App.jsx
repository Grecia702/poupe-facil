import { AuthProvider } from '@context/authContext';
import { ContasProvider } from '@context/contaContext';
import { TransactionProvider } from '@context/transactionsContext';
import { ColorProvider } from '@context/colorScheme';
import Routes from './src/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'react-native-toast-notifications';
import CustomToast from './customToast';
const queryClient = new QueryClient();

export default function App() {

    return (

        <>
            <ColorProvider>
                <ToastProvider
                    renderToast={(toastOptions) => <CustomToast {...toastOptions} />}
                    placement="top"
                >
                    <QueryClientProvider client={queryClient}>
                        <AuthProvider>
                            <ContasProvider>
                                <TransactionProvider>
                                    <Routes />
                                </TransactionProvider>
                            </ContasProvider>
                        </AuthProvider>
                    </QueryClientProvider>
                </ToastProvider>
            </ColorProvider>
        </>
    );
}
