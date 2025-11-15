import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { colorContext } from '@context/colorScheme';
import { useContext, useState, useMemo } from 'react'

const DateButtonNavigation = ({ prevLabel = 'Anterior', nextLabel = 'Avançar', prevAction, nextAction }) => {
    const { isDarkMode } = useContext(colorContext)
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={prevAction} style={[styles.button, { backgroundColor: isDarkMode ? '#4d4d4d' : '#afafaf' }]}>
                <Text style={[styles.buttonText, { color: isDarkMode ? '#cfcfcf' : '#333' }]}>{prevLabel}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={nextAction} style={[styles.button, { backgroundColor: isDarkMode ? '#4d4d4d' : '#afafaf' }]}>
                <Text style={[styles.buttonText, { color: isDarkMode ? '#cfcfcf' : '#333' }]}>{nextLabel}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default DateButtonNavigation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    button: {
        paddingHorizontal: 30,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#666',
        elevation: 2,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 500,
        color: '#d4d4d4'
    }
})