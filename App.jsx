import { AuthProvider } from '@context/authContext';
import { ContasProvider } from '@context/contaContext';
import { TransactionProvider } from '@context/transactionsContext';
import { BudgetProvider } from '@context/budgetsContext';
import { ColorProvider } from '@context/colorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'react-native-toast-notifications';
import CustomToast from './customToast';
import Routes from './src/routes'
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
                            <BudgetProvider>
                                <ContasProvider>
                                    <TransactionProvider>
                                        <Routes />
                                    </TransactionProvider>
                                </ContasProvider>
                            </BudgetProvider>
                        </AuthProvider>
                    </QueryClientProvider>
                </ToastProvider>
            </ColorProvider>
        </>
    );
}
