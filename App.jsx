import { AuthProvider } from './context/authContext';
import { TransactionProvider } from './context/transactionsContext';
import { ColorProvider } from './context/colorScheme';
import Routes from './src/routes'

export default function App() {

    return (

        <AuthProvider>
            <TransactionProvider>
                <ColorProvider>
                    <Routes />
                </ColorProvider>
            </TransactionProvider>
        </AuthProvider>
    );
}
