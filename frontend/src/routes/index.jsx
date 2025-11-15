import { NavigationContainer } from '@react-navigation/native'
import StackRoutes from './stack'
import React, { useContext } from 'react';
import { colorContext } from '@context/colorScheme';
import { StatusBar } from 'react-native';

export default function Routes() {
    const { isDarkMode } = useContext(colorContext)
    return (
        <>
            <NavigationContainer>
                <StatusBar backgroundColor={isDarkMode ? 'rgb(29, 29, 29)' : '#22C55E'} barStyle="light-content" />
                <StackRoutes />
            </NavigationContainer >
        </>
    )
}

