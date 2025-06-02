import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colorContext } from '@context/colorScheme';
import { Feather } from '@expo/vector-icons'
import React, { useContext, useState } from 'react';
import HomeScreen from '@screens/index'
import CreateTransaction from '@components/createTransaction'
import Logout from '@screens/Logout'
const Tab = createBottomTabNavigator();

export default function TabRoutes() {
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const { isDarkMode } = useContext(colorContext)
    return (
        <>
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' },
                    tabBarInactiveTintColor: isDarkMode ? '#555' : '#b1b1b1',
                    tabBarStyle: {
                        backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : '#1d9b4b',
                        height: 60,
                    }
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{
                        tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
                        tabBarActiveTintColor: 'rgb(250,250,250)',
                        tabBarLabelStyle: {
                            fontSize: 16
                        },
                        headerShown: false
                    }}
                />
                <Tab.Screen
                    name="Criar"
                    options={{
                        tabBarIcon: ({ color, size }) => <Feather name="plus" color={color} size={size} />,
                        tabBarActiveTintColor: 'rgb(250,250,250)',
                        tabBarLabelStyle: {
                            fontSize: 16
                        },
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                            setShowTransactionModal(true);
                        }
                    }}
                >
                    {() => null}
                </Tab.Screen>

                <Tab.Screen
                    name="Logout"
                    options={{
                        tabBarIcon: ({ color, size }) => <Feather name="log-out" color={color} size={size} />,
                        tabBarActiveTintColor: 'rgb(250,250,250)',
                        tabBarLabelStyle: {
                            fontSize: 16
                        },
                        headerShown: false
                    }}
                    listeners={{
                        tabPress: e => {
                            e.preventDefault();
                            setShowLogoutModal(true);
                        }
                    }}
                >
                    {() => null}
                </Tab.Screen>
            </Tab.Navigator>
            <CreateTransaction
                isOpen={showTransactionModal}
                setIsOpen={() => setShowTransactionModal(false)}
            />
            <Logout
                isOpen={showLogoutModal}
                setIsOpen={() => setShowLogoutModal(false)}
            />
        </>
    )
}