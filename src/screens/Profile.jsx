import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react'
import { colorContext } from '../../context/colorScheme';
import { useNavigation } from '@react-navigation/native'

export default function Profile() {
    const { isDarkMode, toggleDarkMode } = useContext(colorContext)
    const navigation = useNavigation();
    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : 'rgb(255, 255, 255)' }]}>
            <Pressable style={[styles.button, { borderColor: isDarkMode ? 'rgb(238, 238, 238)' : 'black', backgroundColor: isDarkMode ? 'black' : 'rgb(240,240,240)' }]} onPress={() => toggleDarkMode(true)}>
                <Text style={[styles.text, { color: isDarkMode ? 'rgb(240,240,240)' : 'black' }]}>Profile</Text>
            </Pressable>
        </View >
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        borderWidth: 2,
        borderRadius: 10,
    },
    text: {
        fontSize: 20,
        fontWeight: 600,
    }
});
