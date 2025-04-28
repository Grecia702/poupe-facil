import { AuthProvider } from '@context/authContext';
import { ContasProvider } from '@context/contaContext';
import { TransactionProvider } from '@context/transactionsContext';
import { ColorProvider } from '@context/colorScheme';
import Routes from './src/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {

    return (

        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <ContasProvider>
                    <TransactionProvider>
                        <ColorProvider>
                            <Routes />
                        </ColorProvider>
                    </TransactionProvider>
                </ContasProvider>
            </AuthProvider>
        </QueryClientProvider>

    );
}
