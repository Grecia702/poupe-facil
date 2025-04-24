import { AuthProvider } from './context/authContext';
import { TransactionProvider } from './context/transactionsContext';
import { ColorProvider } from './context/colorScheme';
import Routes from './src/routes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function App() {

    return (

        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <TransactionProvider>
                    <ColorProvider>
                        <Routes />
                    </ColorProvider>
                </TransactionProvider>
            </AuthProvider>
        </QueryClientProvider>

    );
}
