import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const Wrapper = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

export default Wrapper

const styles = StyleSheet.create({
    container: {
        padding: 16,
        gap: 16
    }
})