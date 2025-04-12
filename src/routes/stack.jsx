import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/login';
import React from 'react';
import DrawerRoutes from './drawer.routes';


const Stack = createNativeStackNavigator();

export default function StackRoutes() {

    return (
        <Stack.Navigator  >
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ title: 'Página Login', headerShown: false }}

            />
            <Stack.Screen
                name="home"
                component={DrawerRoutes}
                options={{ title: 'Página Inicial', headerShown: false }}
            />

        </Stack.Navigator>

    );
}
