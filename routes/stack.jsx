import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../app/(tabs)/login';
import React, { useContext } from 'react';
import DrawerRoutes from './drawer.routes';
import { useAuth } from '../context/authContext';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {

    const { isLoggedIn, isLoading } = useAuth()

    if (isLoading) {
        return (
            <View>
                <Text>Carregando...</Text>
            </View>
        )
    }
    return (
        <Stack.Navigator  >
            {
                !isLoggedIn ? (
                    <Stack.Screen
                        name="login"
                        component={LoginScreen}
                        options={{ title: 'Página Login', headerShown: false }}

                    />
                ) : (
                    <Stack.Screen
                        name="home"
                        component={DrawerRoutes}
                        options={{ title: 'Página Inicial', headerShown: false }}
                    />
                )}

        </Stack.Navigator>

    );
}
