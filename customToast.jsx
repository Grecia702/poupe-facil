// CustomToast.jsx
import { View, Text, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { colorContext } from '@context/colorScheme';
import React, { useContext } from 'react';

export default function CustomToast({ message, type }) {
    const { isDarkMode } = useContext(colorContext);
    const iconMap = {
        success: { name: 'check-circle', color: '#56be5a' },
        error: { name: 'error', color: '#f44336' },
        warning: { name: 'warning', color: '#ff9800' },
        info: { name: 'info', color: '#2196f3' },
    };

    const { name: iconName, color: iconColor } = iconMap[type] || {
        name: 'notifications',
        color: '#333',
    };

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#444' : '#EEE', borderColor: iconColor }]}>
            <MaterialIcons
                name={iconName}
                size={24}
                color={iconColor}
                style={styles.icon}
            />
            <Text style={[styles.text, { color: isDarkMode ? '#ddd' : '#222' }]}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        width: '80%',
        paddingVertical: 15,
        borderRadius: 5,
        borderLeftWidth: 10,
        marginHorizontal: 16,
        marginTop: 20,
        flexDirection: 'row',
        gap: 10,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    text: {
        textAlign: 'center',
        alignSelf: 'center',
        fontSize: 16,
        fontWeight: '600',
    },
});
