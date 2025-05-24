import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { colorContext } from '@context/colorScheme';
import { Feather } from '@expo/vector-icons'
import React, { useContext } from 'react';
import HomeScreen from '@screens/index'
import New from '@screens/New'
import Profile from '@screens/Profile';
const Tab = createBottomTabNavigator();

export default function TabRoutes() {

    const { isDarkMode } = useContext(colorContext)
    return (

        <Tab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontWeight: 'bold', color: isDarkMode ? 'white' : 'black' },
                tabBarStyle: {
                    backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : '#22C55E',
                    height: 60,
                }
            }}
        >
            <Tab.Screen
                name="Feed"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
                    tabBarActiveTintColor: isDarkMode ? 'rgb(250,250,250)' : 'rgb(245, 245, 245)',
                    tabBarLabelStyle: {
                        tabBarInactiveTintColor: 'gray',
                        fontSize: 14
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="New"
                component={New}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="plus" color={color} size={size} />,
                    tabBarActiveTintColor: isDarkMode ? 'rgb(250,250,250)' : 'rgb(245, 245, 245)',
                    tabBarLabelStyle: {
                        tabBarInactiveTintColor: 'gray',
                        fontSize: 14
                    },
                    headerShown: false
                }}
            />
            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ color, size }) => <Feather name="log-in" color={color} size={size} />,
                    tabBarActiveTintColor: isDarkMode ? 'rgb(250,250,250)' : 'rgb(245, 245, 245)',
                    tabBarLabelStyle: {
                        tabBarInactiveTintColor: 'gray',

                    },

                    headerShown: false
                }}
            />
        </Tab.Navigator>
    )
}