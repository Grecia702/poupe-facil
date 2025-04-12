import { AuthProvider } from './context/authContext';
import Routes from './src/routes'
import { ColorProvider } from './context/colorScheme';

export default function App() {

    return (

        <AuthProvider>
            <ColorProvider>
                <Routes />
            </ColorProvider>
        </AuthProvider>
    );
}
