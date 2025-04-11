import { Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useContext } from 'react'
import { colorContext } from '../../context/colorScheme';
import ContentLoader, { Rect } from 'react-content-loader/native';

export default function New() {
    const { isDarkMode, toggleDarkMode } = useContext(colorContext)
    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? 'rgb(30, 30, 30)' : 'rgb(199, 199, 199)' }]}>
            <Pressable style={[styles.button, { borderColor: isDarkMode ? 'rgb(238, 238, 238)' : 'black', backgroundColor: isDarkMode ? 'black' : 'rgb(240,240,240)' }]} onPress={() => toggleDarkMode(true)}>
                <Text style={[styles.text, { color: isDarkMode ? 'rgb(240,240,240)' : 'black' }]}>New</Text>
            </Pressable>
            <ContentLoader
                speed={2}
                width={400}
                height={150}
                viewBox="0 0 400 150"
                backgroundColor="#585858"
                foregroundColor="#2b2b2b"
            >
                <Rect x="60" y="10" rx="5" ry="5" width="150" height="20" />
                <Rect x="60" y="60" rx="5" ry="5" width="150" height="20" />
                <Rect x="60" y="110" rx="5" ry="5" width="150" height="20" />
                <Rect x="60" y="160" rx="5" ry="5" width="150" height="20" />
            </ContentLoader>
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