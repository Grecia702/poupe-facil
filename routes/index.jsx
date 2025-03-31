import { NavigationContainer } from '@react-navigation/native'
import StackRoutes from './stack'
import { AuthProvider } from "../context/authContext";
import { ColorProvider } from '../context/colorScheme';

export default function Routes() {
    return (
        <NavigationContainer>
            <ColorProvider>
                <AuthProvider>
                    <StackRoutes />
                </AuthProvider>
            </ColorProvider>
        </NavigationContainer >
    )
}