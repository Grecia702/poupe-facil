import { AuthProvider } from './context/authContext';
import { ColorProvider } from './context/colorScheme';
import Routes from './src/routes'
export default function App() {

    return (
        <AuthProvider>
            <ColorProvider>
                <Routes />
            </ColorProvider>
        </AuthProvider>
    );
}
