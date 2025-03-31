
import { createDrawerNavigator } from '@react-navigation/drawer'
import React, { useContext } from 'react'
import HomeScreen from '../app/(tabs)/index';
import BankAccount from '@/app/(tabs)/accounts';
import Transactions from '@/app/(tabs)/transactions';
import { colorContext } from '../context/colorScheme';
import Feather from '@expo/vector-icons/Feather';
import { TouchableOpacity } from 'react-native';

const Drawer = createDrawerNavigator();


export default function DrawerRoutes() {
    const { isDarkMode, changeState } = useContext(colorContext)
    return (
        <Drawer.Navigator screenOptions={{
            headerRight: () => (
                <TouchableOpacity onPress={() =>
                    changeState(isDarkMode)}
                    style={{ marginRight: 15 }}>
                    {
                        isDarkMode ? (
                            <Feather name="sun" size={24} color="white" />
                        ) : (
                            <Feather name="moon" size={24} color="black" />
                        )
                    }
                </TouchableOpacity>
            ),
            headerTintColor: isDarkMode ? 'white' : 'black',
            headerStyle: {
                backgroundColor: isDarkMode ? 'rgb(15,15,15)' : 'white',
                borderBottomWidth: 1,
                borderColor: 'rgb(200,200,200)',
            },
            title: ''

        }}>
            <Drawer.Screen
                name="pagina principal"
                component={HomeScreen}
                options={{
                    drawerLabel: 'inicio',
                    headerShown: true
                }}
            />
            <Drawer.Screen
                name="contas"
                component={BankAccount}
                options={{
                    drawerLabel: 'Contas'
                }}
            />
            <Drawer.Screen
                name="transações"
                component={Transactions}
                options={{
                    drawerLabel: 'Transações'
                }}
            />

        </Drawer.Navigator>
    )
}


