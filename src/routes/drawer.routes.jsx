import { createDrawerNavigator } from '@react-navigation/drawer'
import { Feather, MaterialIcons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useContext } from 'react';
import { TouchableOpacity } from 'react-native';
import { colorContext } from '../../context/colorScheme';
import TabRoutes from './tab.router';
import StackRoutes from './stack';
import Transactions from '../screens/Transactions'
import Accounts from '../screens/Accounts'
import CreditCards from '../screens/CreditCards'
import Budget from '../screens/Budget'
import Overview from '../screens/Overview'
import Goals from '../screens/Goals'
import Charts from '../screens/Charts'
import Logout from '../screens/Logout'
import Settings from '../screens/Settings'

const Drawer = createDrawerNavigator();
export default function DrawerRoutes() {
    const { isDarkMode, toggleDarkMode } = useContext(colorContext)
    return (
        <Drawer.Navigator

            screenOptions={{
                drawerStyle: {
                    backgroundColor: isDarkMode ? "#202020" : "#dde6e9"
                },
                drawerLabelStyle: {

                    color: isDarkMode ? "#888787" : "#1f2122",
                },
                headerStyle: {
                    backgroundColor: isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E',
                    borderBottomWidth: 1,
                    borderColor: isDarkMode ? "rgba(240, 240, 240, 0.05)" : 'rgba(0, 0, 0, 0.05)',
                },
                headerTintColor: isDarkMode ? 'white' : 'black',
                drawerActiveTintColor: isDarkMode ? "#fff" : 'green',
                drawerActiveBackgroundColor: isDarkMode ? '#3a3939' : '#c7eec7',
                title: '',
                headerRight: () =>
                    <TouchableOpacity
                        onPress={() => toggleDarkMode(true)}
                        style={{ marginRight: 20 }}
                    >
                        <Feather name={isDarkMode ? "moon" : "sun"} size={24} color={isDarkMode ? "white" : "black"}></Feather>
                    </TouchableOpacity>,
            }} >
            <Drawer.Screen
                name="home"
                component={TabRoutes}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialIcons name="grid-view" size={size} color={color} />,
                    drawerLabel: 'Inicio',
                }}
            />
            <Drawer.Screen
                name="Transações"
                component={Transactions}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialIcons name="trending-down" size={size} color={color} />,
                    drawerLabel: 'Transações',
                }}
            />
            <Drawer.Screen
                name="Contas Bancárias"
                component={Accounts}
                options={{
                    drawerIcon: ({ color, size }) => <FontAwesome name="bank" size={size} color={color} />,
                    drawerLabel: 'Contas Bancárias',
                }}
            />
            <Drawer.Screen
                name="Cartões de Crédito"
                component={CreditCards}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name="credit-card" color={color} size={size} />,
                    drawerLabel: 'Cartões de Crédito',
                }}
            />
            <Drawer.Screen
                name="Orçamento"
                component={Budget}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialIcons name="account-balance-wallet" size={size} color={color} />,
                    drawerLabel: 'Orçamento',
                }}
            />
            <Drawer.Screen
                name="Metas"
                component={Goals}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialCommunityIcons name="piggy-bank" size={size} color={color} />,
                    drawerLabel: 'Metas',
                }}
            />
            <Drawer.Screen
                name="Gráficos"
                component={Charts}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialIcons name="pie-chart" size={size} color={color} />,
                    drawerLabel: 'Gráficos',
                }}
            />
            <Drawer.Screen
                name="Resumo Financeiro"
                component={Overview}
                options={{
                    drawerIcon: ({ color, size }) => <FontAwesome name="bar-chart" size={size} color={color} />,
                    drawerLabel: 'Resumo Financeiro',
                }}
            />
            <Drawer.Screen
                name="Perfil"
                component={StackRoutes}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />,
                    drawerLabel: 'Perfil',
                    headerShown: false
                }}
            />
            <Drawer.Screen
                name="Configurações"
                component={Settings}
                options={{
                    drawerIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />,
                    drawerLabel: 'Configurações',
                    headerShown: false
                }}
            />
            <Drawer.Screen
                name="Logout"
                component={Logout}
                options={{
                    drawerIcon: ({ color, size }) => <MaterialIcons name="logout" size={size} color={color} />,
                    drawerLabel: 'Logout',
                    headerShown: false
                }}
            />
        </Drawer.Navigator>
    )
}