import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useContext } from 'react';
import DrawerRoutes from './drawer.routes';
import LoginScreen from '../screens/login';
import SignupScreen from '../screens/Signup';
import EditTransactions from '../screens/Transactions/EditTransactions';
import CreateTransaction from '../screens/Transactions/CreateTransactions';
import { colorContext } from '@context/colorScheme';
import AuthLoadingScreen from '@context/authLoadingScreen';

const Stack = createNativeStackNavigator();

export default function StackRoutes() {
    const { isDarkMode } = useContext(colorContext)
    return (
        <Stack.Navigator  >
            <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
            <Stack.Screen
                name="login"
                component={LoginScreen}
                options={{ title: 'Página Login', headerShown: false }}

            />
            <Stack.Screen
                name="signup"
                component={SignupScreen}
                options={{ title: 'Página Cadastro', headerShown: false }}

            />
            <Stack.Screen
                name="home"
                component={DrawerRoutes}
                options={{ title: 'Página Inicial', headerShown: false }}
            />
            <Stack.Screen
                name="EditTransactions"
                component={EditTransactions}
                options={{
                    title: 'Editar Transação', headerShown: true,
                    headerStyle: {
                        backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
                    },
                    headerTintColor: isDarkMode ? "white" : 'black'
                }}
            />
            <Stack.Screen
                name="CreateTransaction"
                component={CreateTransaction}
                options={{
                    title: 'Criar Transação', headerShown: true,
                    headerStyle: {
                        backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
                    },
                    headerTintColor: isDarkMode ? "white" : 'black'
                }}
            />
        </Stack.Navigator>
    );
}
