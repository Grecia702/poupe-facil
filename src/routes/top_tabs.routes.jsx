import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Piechart from '../screens/Charts/Piechart';
import Barchart from '../screens/Charts/Barchart';
import React, { useContext } from 'react';
import Linechart from '../screens/Charts/Linechart';
import { MaterialIcons } from '@expo/vector-icons'
import { colorContext } from '../../context/colorScheme';

const Tab = createMaterialTopTabNavigator();

export default function TopTabRoutes() {
    const { isDarkMode } = useContext(colorContext)
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                swipeEnabled: true,
                tabBarIndicatorStyle: { backgroundColor: '#00cccc' },
                tabBarStyle: { backgroundColor: isDarkMode ? "#202020" : '#fff' },
                tabBarLabelStyle: { fontWeight: 'bold', fontSize: 14 },
                tabBarActiveTintColor: '#00cccc',
                tabBarInactiveTintColor: '#999',
                tabBarIcon: ({ color }) => {
                    if (route.name === 'Categorias') {
                        return <MaterialIcons name="pie-chart" size={24} color={color} />
                    }
                    if (route.name === 'Semanas') {
                        return <MaterialIcons name="bar-chart" size={24} color={color} />
                    }
                    if (route.name === 'Evolução') {
                        return <MaterialIcons name="show-chart" size={24} color={color} />
                    }
                },
                tabBarShowIcon: true,
            })}
        >
            <Tab.Screen name="Categorias" component={Piechart} />
            <Tab.Screen name="Semanas" component={Barchart} />
            <Tab.Screen name="Evolução" component={Linechart} />
        </Tab.Navigator>
    );
}
